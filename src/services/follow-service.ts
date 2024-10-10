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
      include: {
        followed: true,
      },
    });

    return follow;
  }

  async unfollowUser(
    loggedInUserId: number,
    followedId: number
  ): Promise<void> {
    const unfollow = await prisma.follow.deleteMany({
      where: {
        followerId: loggedInUserId,
        followedId: followedId,
      },
    });

    if (!unfollow.count) {
      throw new Error("No follow relationship found to unfollow");
    }
  }

  async getFollowers(loggedInUserId: number) {
    const followers = await prisma.follow.findMany({
      where: {
        followedId: loggedInUserId, // Orang yang mengikuti saya
      },
      include: {
        follower: true, // Pengguna yang mengikuti
      },
    });

    const followersWithIsFollowing = await Promise.all(
      followers.map(async (follow) => {
        const isFollowing = await prisma.follow.findFirst({
          where: {
            followerId: loggedInUserId, // Saya
            followedId: follow.followerId, // Pengguna yang mengikuti saya
          },
        });

        return {
          id: follow.id,
          followerId: follow.followerId,
          follower: {
            id: follow.follower.id,
            fullName: follow.follower.fullName,
            username: follow.follower.username,
            bio: follow.follower.bio,
            image: follow.follower.image,
          },
          isFollowing: Boolean(isFollowing),
        };
      })
    );

    return followersWithIsFollowing;
  }

  async getFollowing(loggedInUserId: number) {
    const following = await prisma.follow.findMany({
      where: {
        followerId: loggedInUserId, // Saya mengikuti mereka
      },
      include: {
        followed: true, // Pengguna yang diikuti
      },
    });

    return following.map((follow) => ({
      id: follow.id,
      followedId: follow.followedId,
      followed: {
        id: follow.followed.id,
        fullName: follow.followed.fullName,
        username: follow.followed.username,
        bio: follow.followed.bio,
        image: follow.followed.image,
      },
      isFollowing: true, // Saya sudah pasti mengikuti mereka
    }));
  }
}

export default new FollowService();
