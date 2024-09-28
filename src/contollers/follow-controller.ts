import { Request, Response } from "express";
import followService from "../services/follow-service";

class followController {
  async getFollowers(req: Request, res: Response) {
    const userId = Number(req.params.userId); // Ambil userId dari parameter URL

    try {
      const followers = await followService.getFollowersByUserId(userId);
      res.status(200).json({ followers }); 
    } catch (error) {
      res.status(500).json({ error: (error as Error).message }); 
    }
  }
}

export default new followController()