import { Request, Response } from "express";
import FollowService from "../services/follow-service";
import { number } from "joi";
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
    const followerId = (req as any).user.id; // Tidak perlu casting ke 'any' jika sudah dideklarasikan
    const { followingId } = req.body;

    // Validasi followingId
    if (!followingId) {
        return res.status(400).json({ error: "followingId is required" });
    }

    // Validasi followerId yang didapatkan dari req.user
    if (!followerId) {
        return res.status(400).json({ error: "followerId is required" });
    }

    try {
        // Memanggil service untuk membuat follow
        const follow = await followService.createFollow(followerId, followingId);
        return res.status(201).json({ message: "Followed successfully", follow });
    } catch (error) {
      console.error("Follow User Error:", error); // Tambahkan log ini
      if ((error as Error).message.includes("User not found")) {
          return res.status(404).json({ error: "Invalid followerId or followingId" });
      }
      if ((error as Error).message.includes("Already following this user")) {
          return res.status(409).json({ error: "You are already following this user" });
      }
      return res.status(500).json({ error: "An error occurred while trying to follow the user." });
  }  
}


  
  async getFollowers(req: Request, res: Response) {
    const { userId } = req.params;
    try {
      const followers = await followService.getFollowers(Number(userId));
      return res.status(200).json(followers);
    } catch (error) {
      return res.status(500).json({ message: (error as Error).message });
    }
  }

  async getFollowing(req: Request, res: Response) {
    const { userId } = req.params;
    try {
      const following = await followService.getFollowing(Number(userId));
      return res.status(200).json(following);
    } catch (error) {
      return res.status(500).json({ message: (error as Error).message });
    }
  }
}

export default new FollowController(); // Ekspor sebagai singleton