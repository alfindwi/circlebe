import { PrismaClient, Thread, User } from "@prisma/client"
import { customError, customErrorCode } from "../types/error"
import { CreateThreadDTO, UpdateThreadDTO } from "../dto/thread-dto"

const prisma = new PrismaClient()

class threadService{
  async getAllThreads(): Promise<Thread[]> {
    return await prisma.thread.findMany({
      include: {
        user: true,
      },
    });
  }

  async getThreadById(id: number) {
    const thread = await prisma.thread.findUnique({
        where: { id },
        include: {
            user: true, 
            replies: true, 
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

    await prisma.thread.update({
        where: { id: threadId },
        data: {
            repliesCount: {
                increment: 1,
            },
        },
    });

    return reply;
  }


    async getThreadsByUserId(userId: number): Promise<Thread[]> {
      try {
          const threads = await prisma.thread.findMany({
              where: { userId : userId },
              include: { user: true },
          });
  
          return threads;
      } catch (error) {
          console.error("Prisma query error:", error);
          throw new Error("Error fetching threads from the database");
      }
    }
    
  
  


  async createThread(data: CreateThreadDTO, user: User): Promise<Thread | null> {
    if (!user) {
      throw {
        code: customErrorCode.THREAD_NOT_EXIST  ,
        message: "User not Found!",
        status: 404,
      } as customError;
    }
    return await prisma.thread.create({
      data: {
        ...data,
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
  
      if (data.content) {
        thread.content = data.content;
      }
  
      if (data.image) {
        thread.image = data.image;
      }
  
      return await prisma.thread.update({
        data: thread,
        where: { id: data.id },
      });
    }

    async deleteThread(id: number): Promise<Thread | null> {
      const thread = await prisma.thread.findUnique({
          where: {id},
        });
    
        if (!thread) {
          throw {
            status: 404,
            message: "Thread not found!",
            code: customErrorCode.USERS_NOT_EXIST
          } as customError
        }
    
        return await prisma.thread.delete({
          where: { id},
        });
  }
      
}

export default new threadService()