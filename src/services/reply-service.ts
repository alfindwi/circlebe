import { PrismaClient, Reply, Thread } from "@prisma/client"
import { customError, customErrorCode } from "../types/error"
import { CreateThreadDTO } from "../dto/thread-dto"
import { createReplyDTO } from "../dto/reply-dto"

const prisma = new PrismaClient()

class replyService {
  async getAllReply(): Promise<Reply[]> {
    const replies = await prisma.reply.findMany({
      include: {
        user: true, 
      },
    });

    if (!replies || replies.length === 0) {
      throw {
        status: 404,
        message: "Reply not found!",
        code: customErrorCode.THREAD_NOT_EXIST,
      } as customError;
    }

    return replies;
  }

  async createReply(data: createReplyDTO): Promise<Reply> {
    const threadId = Number(data.threadId); 

    const threadExists = await prisma.thread.findUnique({
      where: { id: threadId },
    });

    if (!threadExists) {
      throw {
        code: customErrorCode.THREAD_NOT_EXIST,
        message: 'Thread not found!',
        status: 404,
      } as customError;
    }

    const newReply = await prisma.reply.create({
      data: {
        content: data.content,
        image: data.image,
        userId: data.userId,  
        threadId: threadId,   
      },
    });

    return newReply;
  }

  async getRepliesByThreadId(threadId: number): Promise<Reply[]> {
    try {
      const replies = await prisma.reply.findMany({
        where: { threadId: threadId }, 
        include: { 
          user: {
            include: {
              followeds: true ,
              followers: true,
            }
          }, 
        },      
      });

      return replies;
    } catch (error) {
      console.error("Prisma query error:", error);
      throw new Error("Error fetching replies from database");
    }
  }

  async addLikeToReply(replyId: number, userId: number): Promise<string> {
    const existingLike = await prisma.like.findUnique({
        where: {
            userId_replyId: {
                userId,
                replyId,
            },
        },
    });

    if (existingLike) {
        throw new Error("User has already liked this reply");
    }

    await prisma.like.create({
        data: {
            userId,
            replyId,
        },
    });

    return "Like added successfully";
}


  async removeLikeFromReply(replyId: number, userId: number): Promise<string> {
    const existingLike = await prisma.like.findUnique({
        where: {
            userId_replyId: {
                userId,
                replyId,
            },
        },
    });

    if (!existingLike) {
        throw new Error("Like does not exist");
    }

    await prisma.like.delete({
        where: {
            id: existingLike.id, // Assuming `id` is the primary key for the like record
        },
    });

    return "Like removed successfully";
}
}


export default new replyService()