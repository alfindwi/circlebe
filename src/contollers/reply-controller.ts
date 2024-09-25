import { Request, Response } from "express";
import replyService from "../services/reply-service";

class replyController {
    async findReply (req: Request, res: Response) {
        try {
            const reply = await replyService.getAllReply();
            res.json(reply);
        } catch (error) {
            res.json(error)
        }
    }

    async createReply (req: Request, res: Response) {
        try {
            const replies = await replyService.createReply(req.body);
            res.json({replies});
        } catch (error) {
            res.json(error)
        }
    }


    
}

export default new replyController()