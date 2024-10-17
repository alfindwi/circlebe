import { PrismaClient, Thread, User } from "@prisma/client";
import { customError, customErrorCode } from "../types/error";
import { CreateThreadDTO, UpdateThreadDTO } from "../dto/thread-dto";

const prisma = new PrismaClient();

class threadService {
  async getAllThreads(): Promise<Thread[]> {
    return await prisma.thread.findMany({
      include: {
        user: true,
        replies: true,
        likes: true,
      },
      orderBy: {
        createdAt: "desc",
      }
    });
  }

  async getThreadById(id: number) {
    const thread = await prisma.thread.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            username: true,
            image: true,
            bio: true,
          },
        },
        replies: true,
        likes: true,
      },
    });

    if (!thread) {
      throw new Error("Thread not found");
    }

    return thread;
  }

  async addReplyToThread(threadId: number, replyData: any) {
    const reply = await prisma.reply.create({
      data: {
        ...replyData,
        threadId: threadId,
      },
    });

    return reply;
  }

  async addLikeToThread(threadId: number, userId: number): Promise<void> {
    await prisma.like.upsert({
      where: {
        userId_threadId: {
          userId,
          threadId,
        },
      },
      update: {}, // Jika sudah ada, tidak perlu update apa pun
      create: {
        userId,
        threadId,
      },
    });
  }

  async checkIfUserLikedThread(
    threadId: number,
    userId: number
  ): Promise<boolean> {
    const like = await prisma.like.findFirst({
      where: {
        threadId,
        userId,
      },
    });
    return !!like; // Mengembalikan true jika like ditemukan
  }

  async removeLikeFromThread(threadId: number, userId: number): Promise<void> {
    await prisma.like.deleteMany({
      where: {
        threadId,
        userId,
      },
    });
  }

  async getThreadsByUserId(userId: number): Promise<Thread[]> {
    try {
      const threads = await prisma.thread.findMany({
        where: { userId: userId },
        include: {
          user: {
            include: {
              followeds: true,
              followers: true,
            },
          },
          replies: true,
          likes: true,
        },
      });

      return threads;
    } catch (error) {
      console.error("Prisma query error:", error);
      throw new Error("Error fetching threads from the database");
    }
  }

  async createThread(
    data: CreateThreadDTO,
    user: User
  ): Promise<Thread | null> {
    if (!user) {
      throw {
        code: customErrorCode.THREAD_NOT_EXIST,
        message: "User not Found!",
        status: 404,
      } as customError;
    }

    return await prisma.thread.create({
      data: {
        content: data.content,
        image: data.image || null,
        userId: user.id,
      },
    });
  }

  async updateThread(data: UpdateThreadDTO): Promise<Thread | null> {
    const thread = await prisma.thread.findUnique({
      where: {
        id: data.id,
      },
    });

    if (!thread) {
      throw {
        status: 404,
        message: "Thread not found!",
        code: customErrorCode.THREAD_NOT_EXIST,
      } as customError;
    }

    return await prisma.thread.update({
      data: {
        content: data.content || thread.content,
        image: data.image || thread.image,
      },
      where: { id: data.id },
    });
  }

  async deleteThread(id: number): Promise<Thread | null> {
    const thread = await prisma.thread.findUnique({
      where: { id },
    });

    if (!thread) {
      throw {
        status: 404,
        message: "Thread not found!",
        code: customErrorCode.USERS_NOT_EXIST,
      } as customError;
    }

    return await prisma.thread.delete({
      where: { id },
    });
  }
}

export default new threadService();
