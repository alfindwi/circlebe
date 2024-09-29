import { Request, Response } from "express";
import FollowService from "../services/follow-service";
import { number } from "joi";
import followService from "../services/follow-service";

class FollowController {
  async followUser(req: Request, res: Response) {
    const followerId = (req as any).user.id; 
    const { followingId } = req.body;

    if (!followingId) {
      return res.status(400).json({ error: "followingId is required" });
    }

    if (!followerId) {
      return res.status(400).json({ error: "followerId is required" });
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
    /*  #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/UnfollowRequest"
          }
        }
      }
    }
  */
            const followerId = (req as any).user.id; // Ambil followerId dari user yang terautentikasi
            const { followingId } = req.body;
          
            // Validasi apakah followingId ada dalam request
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
    const { userId } = req.params;

    try {
      const followers = await followService.getFollowers(Number(userId));
      return res.status(200).json(followers);
    } catch (error) {
      console.error("Get Followers Error:", (error as Error).message);
      return res.status(500).json({ error: "An error occurred while retrieving followers.", details: (error as Error).message });
    }
  }

  async getFollowing(req: Request, res: Response) {
    const { userId } = req.params;

    try {
      const following = await followService.getFollowing(Number(userId));
      return res.status(200).json(following);
    } catch (error) {
      console.error("Get Following Error:", (error as Error).message);
      return res.status(500).json({ error: "An error occurred while retrieving following.", details: (error as Error).message });
    }
  }
}


export default new FollowController(); 