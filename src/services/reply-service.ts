import { PrismaClient, Reply, Thread } from "@prisma/client"
import { customError, customErrorCode } from "../types/error"
import { CreateThreadDTO } from "../dto/thread-dto"
import { ReplyDTO } from "../dto/reply-dto"

const prisma = new PrismaClient()

class replyService{
     async getAllReply() : Promise<Reply[]> {
      const reply = await prisma.reply.findMany()

      if(!reply) {
        throw {
          status: 404,
          message: "Reply not found!",
          code: customErrorCode.THREAD_NOT_EXIST
        } as customError
      }
        return reply
    }

    async createReply(reply: Omit<ReplyDTO, 'id' | 'createdAt' | 'updatedAt'>): Promise<Reply> {
      try {
        // Ensure the thread exists
        const threadExists = await prisma.thread.findUnique({
          where: { id: reply.threadId },
        });
        if (!threadExists) {
          throw new Error(`Thread with ID ${reply.threadId} does not exist.`);
        }
    
        // Ensure the user exists
        const userExists = await prisma.user.findUnique({
          where: { id: reply.userId },
        });
        if (!userExists) {
          throw new Error(`User with ID ${reply.userId} does not exist.`);
        }
    
        // Create reply record
        const newReply = await prisma.reply.create({
          data: {
            content: reply.content,
            image: reply.image,
            likes: reply.likes,
            threadId: reply.threadId,
            userId: reply.userId,
          },
        });
        return newReply;
      } catch (error) {
        console.error('Error creating reply:', error);
        throw error;
      }
    }
    
      
}

export default new replyService()