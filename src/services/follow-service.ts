import { PrismaClient } from "@prisma/client";
import { CreateFollowDTO } from "../dto/follow-dto";
import { customError, customErrorCode } from "../types/error";
import { boolean } from "joi";

const prisma = new PrismaClient();

export class FollowService {
  async createFollow(loggedInUserId: number, followedId: number) {
    const [followerExists, followingExists] = await Promise.all([
      prisma.user.findUnique({ where: { id: loggedInUserId } }),
      prisma.user.findUnique({ where: { id: followedId } }),
    ]);

    if (!followerExists || !followingExists) {
      throw new Error("Invalid followerId or followedId: User not found");
    }

    const followExists = await prisma.follow.findUnique({
      where: {
        followerId_followedId: {
          followerId: loggedInUserId,
          followedId: followedId,
        },
      },
    });

    if (followExists) {
      throw new Error("Already following this user");
    }

    const follow = await prisma.follow.create({
      data: {
        followerId: loggedInUserId,
        followedId: followedId,
      },
      include:{
        followed: true
      }
    });

    return follow;
  }

  async unfollowUser(loggedInUserId: number, followedId: number): Promise<void> {
    await prisma.follow.deleteMany({
      where: {
        followerId: loggedInUserId,
        followedId: followedId,
      },
    });
  }

  async getFollowers(loggedInUserId: number) {
    const followers = await prisma.follow.findMany({
      where: {
        followedId: loggedInUserId, 
      },
      include: {
        follower: true, 
      },
    });

    return followers.map(follow => ({
      id: follow.id,
      followerId: follow.followerId,
      follower: {
        id: follow.follower?.id,
        fullName: follow.follower?.fullName,
        username: follow.follower?.username,
        bio: follow.follower?.bio,
        image: follow.follower?.image,
      },
    }));
  }

  // Mendapatkan daftar following, hanya untuk user yang sedang login
  async getFollowing(loggedInUserId: number) {
    const following = await prisma.follow.findMany({
      where: {
        followerId: loggedInUserId, // Hanya bisa mendapatkan following untuk user yang sedang login
      },
      include: {
        followed: true, // Sertakan informasi dari pengguna yang di-follow
      },
    });

    return following.map(follow => ({
      id: follow.id,
      followedId: follow.followedId,
      followed: {
        id: follow.followed?.id,
        fullName: follow.followed?.fullName,
        username: follow.followed?.username,
        bio: follow.followed?.bio,
        image: follow.followed?.image,
      },
    }));
  }
}

export default new FollowService();