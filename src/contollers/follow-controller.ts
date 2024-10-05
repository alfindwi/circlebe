import { Request, Response } from "express";
import followService from "../services/follow-service";

export class FollowController {
  async followUser(req: Request, res: Response) {
    const userId = (req as any).user.id; 
    const { followedId } = req.body;

    if (!followedId) {
      return res.status(400).json({ error: "Followed user ID is required" });
    }

    try {
      const follow = await followService.createFollow(userId, followedId);
      return res.status(201).json({ message: "Followed successfully", follow });
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message || "An error occurred while trying to follow the user." });
    }
  }

  async unfollowUser(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const { followedId } = req.body;

    if (!followedId) {
      return res.status(400).json({ error: "Followed user ID is required" });
    }

    try {
      await followService.unfollowUser(userId, followedId);
      return res.status(200).json({ message: "Unfollowed successfully" });
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message || "An error occurred while trying to unfollow the user." });
    }
  }

  async getFollowers(req: Request, res: Response) {
    try {
        const userId = (req as any).user.id; // Ambil user ID dari token
        const followers = await followService.getFollowers(userId);
        return res.status(200).json(followers);
    } catch (error) {
        return res.status(500).json({ error: (error as Error).message || "An error occurred while retrieving followers." });
    }
}

  async getFollowing(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const following = await followService.getFollowing(userId);
      return res.status(200).json(following);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message || "An error occurred while retrieving following users." });
    }
  }
}



export default new FollowController();