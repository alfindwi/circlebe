import { Request, Response } from "express";
import replyService from "../services/reply-service";
import cloudinaryService from "../services/cloudinary-service";
import { createReplyScehma } from "../utils/schema/reply-schema";

class replyController {
  async findReply(req: Request, res: Response) {
    try {
      const reply = await replyService.getAllReply();
      res.json(reply);
    } catch (error) {
      res.json(error);
    }
  }

  async getRepliesByThreadId(req: Request, res: Response) {
    try {
      const { id: threadId } = req.params;
      const replies = await replyService.getRepliesByThreadId(Number(threadId));

      if (!replies || replies.length === 0) {
        return res
          .status(404)
          .json({ message: "No replies found for this thread" });
      }

      res.json(replies);
    } catch (error) {
      console.error("Error fetching replies:", error);
      res.status(500).json({ error: "Failed to fetch replies" });
    }
  }

  async createReply(req: Request, res: Response) {
    try {
      let imageUrl: string | null = null; 

      if (req.file) {
        const image = await cloudinaryService.uploadSingle(req.file);
        imageUrl = image.url; 
      }

      const { threadId, ...rest } = req.body;

      const body = {
        ...rest,
        image: imageUrl ? String(imageUrl) : null, 
        threadId: Number(threadId), 
      };

      const value = await createReplyScehma.validateAsync(body);

      const replyData = {
        ...value,
        userId: (req as any).user.id, 
      };

      const replies = await replyService.createReply(replyData);

      res.json({ replies });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
}


  async addLikeFromReply(req: Request, res: Response) {
    /*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/AddReplyLikeDTO"
                    }  
                }
            }
        } 
        */
        try {
          const { replyId } = req.params; 
          const user = (req as any).user; 

          if (!user) {
              return res.status(401).json({ message: "User not authenticated" });
          }

          const isLiked = await replyService.checkIfUserLikedReply(Number(replyId), user.id);

          if (isLiked) {
              await replyService.removeLikeFromReply(Number(replyId), user.id);
              return res.status(200).json({ message: "Like removed", isLiked: false });
          } else {
              await replyService.addLikeToReply(Number(replyId), user.id);
              return res.status(200).json({ message: "Like added", isLiked: true });
          }
      } catch (error) {
          return res.status(500).json({ message: (error as Error).message });
      }
  }

  async removeLikeFromReply(req: Request, res: Response) {
    /*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/RemoveReplyLikeDTO"
                    }  
                }
            }
        } 
    */
    try {
      const { threadId } = req.params;
      const user = (req as any).user;

      if (!user) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const message = await replyService.removeLikeFromReply(
        Number(threadId),
        user.id
      );
      res.status(200).json({ message });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
}

export default new replyController();
