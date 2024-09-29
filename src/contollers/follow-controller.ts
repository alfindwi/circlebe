import { Request, Response } from "express";
import followService from "../services/follow-service";

class FollowController {
  async followUser(req: Request, res: Response) {
    /*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/CreateFollowDTO"
                    }  
                }
            }
        } 
        */
    const followerId = (req as any).user.id; 
    const { followingId } = req.body; 

    if (!followingId) {
      return res.status(400).json({ error: "followingId is required" });
    }

    try {
      const follow = await followService.createFollow(followerId, followingId);
      return res.status(201).json({ message: "Followed successfully", follow });
    } catch (error) {
      console.error("Create Follow Error:", (error as Error).message);
      return res.status(500).json({ error: "An error occurred while trying to follow the user.", details: (error as Error).message });
    }
  }

  async unfollowUser(req: Request, res: Response) {
    const followerId = (req as any).user.id;
    const { followingId } = req.body;

    if (!followingId) {
      return res.status(400).json({ error: "followingId is required" });
    }

    try {
      await followService.unfollowUser(followerId, followingId);
      return res.status(200).json({ message: "Unfollowed successfully" });
    } catch (error) {
      console.error("Unfollow Error:", (error as Error).message);
      return res.status(500).json({ error: "An error occurred while trying to unfollow the user.", details: (error as Error).message });
    }
  }

  async getFollowers(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const followers = await followService.getFollowers(userId);
      return res.status(200).json(followers);
    } catch (error) {
      console.error("Get Followers Error:", (error as Error).message);
      return res.status(500).json({ error: "An error occurred while retrieving followers.", details: (error as Error).message });
    }
  }

  async getFollowing(req: Request, res: Response) {
    try {
        const userId = (req as any).user.id; // Ambil ID pengguna dari token
        const followingData = await followService.getFollowing(userId);
        return res.status(200).json(followingData); // Kirim data following ke klien
    } catch (error) {
        console.error("Get Following Error:", (error as Error).message);
        return res.status(500).json({ error: "An error occurred while retrieving following.", details: (error as Error).message });
    }
}
}

export default new FollowController();
