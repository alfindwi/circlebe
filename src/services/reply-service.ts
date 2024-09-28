import { PrismaClient, Reply, Thread } from "@prisma/client"
import { customError, customErrorCode } from "../types/error"
import { CreateThreadDTO } from "../dto/thread-dto"
import { createReplyDTO } from "../dto/reply-dto"

const prisma = new PrismaClient()

class replyService{
     async getAllReply() : Promise<Reply[]> {
      const reply = await prisma.reply.findMany({
        include: {
          user: true,
        },
      })

      if(!reply) {
        throw {
          status: 404,
          message: "Reply not found!",
          code: customErrorCode.THREAD_NOT_EXIST
        } as customError
      }
        return reply
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
              likes: 0,
          },
      });
  
      return newReply;
    }

    async getRepliesByThreadId(threadId: number): Promise<Reply[]> {
      try {
          const replies = await prisma.reply.findMany({
            where: { threadId: threadId },
            include: { user: true },
          });
          
          return replies;
      } catch (error) {
          console.error("Prisma query error:", error); 
          throw new Error("Error fetching replies from database");
      }
  }
  

    
    
  
  
  
    
      
}

export default new replyService()