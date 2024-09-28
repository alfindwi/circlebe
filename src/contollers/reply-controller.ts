import { Request, Response } from "express";
import replyService from "../services/reply-service";
import cloudinaryService from "../services/cloudinary-service";
import { createReplyScehma } from "../utils/schema/reply-schema";

class replyController {
    async findReply (req: Request, res: Response) {
        try {
            const reply = await replyService.getAllReply();
            res.json(reply);
        } catch (error) {
            res.json(error)
        }
    }
    
    async  getRepliesByThreadId(req: Request, res: Response) {
        try {
            const { id: threadId } = req.params;  
            const replies = await replyService.getRepliesByThreadId(Number(threadId));  

            if (!replies || replies.length === 0) {
                return res.status(404).json({ message: "No replies found for this thread" });  
            }
            
            res.json(replies);
        } catch (error) {
            console.error("Error fetching replies:", error);  
            res.status(500).json({ error: "Failed to fetch replies" }); 
        }
    }

    async createReply(req: Request, res: Response) {
         /*  #swagger.requestBody = {
                required: true,
                content: {
                    "multipart/form-data": {
                        schema: {
                            $ref: "#/components/schemas/CreateReplyDTO"
                        }  
                    }
                }
            } 
        */
        try {
            const image = await cloudinaryService.uploadSingle(req.file as Express.Multer.File);
            const { threadId, ...rest } = req.body;
            
            const body = {
                ...rest,
                image: image.secure_url,
                threadId,
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

    

  
    
    
    
    


    
}

export default new replyController()