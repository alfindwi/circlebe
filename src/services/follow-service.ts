import { PrismaClient } from "@prisma/client";
import { CreateFollowDTO } from "../dto/follow-dto";
import { customError, customErrorCode } from "../types/error";
import { boolean } from "joi";

const prisma = new PrismaClient();

class FollowService {
  async createFollow(followerId: number, followingId: number) {
    const [followerExists, followingExists] = await Promise.all([
      prisma.user.findUnique({ where: { id: followerId } }),
      prisma.user.findUnique({ where: { id: followingId } }),
    ]);

    if (!followerExists || !followingExists) {
      throw new Error("Invalid followerId or followingId: User not found");
    }

    const followExists = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: followerId,
          followingId: followingId,
        },
      },
    });

    if (followExists) {
      throw new Error("Already following this user");
    }

    const follow = await prisma.follow.create({
      data: {
        followerId: followerId,
        followingId: followingId,
      },
    });

    return follow;
  }

  async unfollowUser(followerId: number, followingId: number): Promise<void> {
    await prisma.follow.deleteMany({
      where: {
        followerId,
        followingId,
      },
    });
  }

  async getFollowers(userId: number) {
    const followers = await prisma.follow.findMany({
        where: {
            followingId: userId, 
        },
        include: {
            follower: true,
        },
    });

    return followers.map(follow => ({
        id: follow.id,
        followerId: follow.followerId,
        followingId: follow.followingId,
        follower: follow.follower,
        isFollowing: false,
    }));
  }

  async getFollowersByUserId(userId: number) {
    return await prisma.follow.findMany({
      where: {
        followingId: userId,  // Ambil semua pengguna yang mengikuti userId ini
      },
      include: {
        follower: true, // Sertakan informasi dari follower
      },
    });
  }

  async getFollowingByUserId(userId: number) {
    return await prisma.follow.findMany({
      where: {
        followerId: userId,  
      },
      include: {
        following: true, 
      },
    });
  }

  async getFollowing(userId: number) {
    const following = await prisma.follow.findMany({
        where: {
            followerId: userId, 
        },
        include: {
            following: true,
        },
    });

    return following.map(follow => ({
        id: follow.id,
        followerId: follow.followerId,
        followingId: follow.followingId,
        following: follow.following,
        isFollowing: false,
    }));
  }
}

export default new FollowService();
