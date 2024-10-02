import { PrismaClient } from "@prisma/client";
import { CreateFollowDTO } from "../dto/follow-dto";
import { customError, customErrorCode } from "../types/error";
import { boolean } from "joi";

const prisma = new PrismaClient();

class FollowService {
  // Create follow relationship
  async createFollow(followerId: number, followedId: number) {
    const [followerExists, followedExists] = await Promise.all([
      prisma.user.findUnique({ where: { id: followerId } }),
      prisma.user.findUnique({ where: { id: followedId } }),
    ]);

    if (!followerExists || !followedExists) {
      throw new Error("Invalid followerId or followedId: User not found");
    }


    const follow = await prisma.follow.create({
      data: {
        followerId: followerId,
        followedId: followedId,
      },
    });

    return follow;
  }

  async unfollowUser(followerId: number, followedId: number): Promise<void> {
    await prisma.follow.deleteMany({
      where: {
        followerId,
        followedId,
      },
    });
  }

  async getFollowers(userId: number) {
    const followers = await prisma.follow.findMany({
      where: {
        followedId: userId, // Users following this user
      },
      include: {
        follower: true,
      },
    });

    return followers.map(follow => ({
      id: follow.id,
      followerId: follow.followerId,
      followedId: follow.followedId,
      follower: follow.follower,
      isFollowing: false, 
    }));
  }

  async getFollowing(userId: number) {
    const following = await prisma.follow.findMany({
      where: {
        followerId: userId, 
      },
      include: {
        followed: true, 
      },
    });

    return following.map(follow => ({
      id: follow.id,
      followerId: follow.followerId,
      followedId: follow.followedId,
      followed: follow.followed,
      isFollowing: false,
    }));
  }
}


export default new FollowService();
