import { Follow, PrismaClient } from "@prisma/client";
import { FollowDTO } from "../dto/follow-dto";
import { customError, customErrorCode } from "../types/error";

const prisma = new PrismaClient()

class followService {
  async getAllFollow(): Promise<Follow[]> {
    try {
      const follows = await prisma.follow.findMany();

      if (follows.length === 0) {
        throw {
          status: 404,
          message: "No follows found!",
          code: customErrorCode.FOLLOW_NOT_EXIST,
        } as customError;
      }

      return follows;
    } catch (error) {
      console.error('Error getting all follows:', error);
      throw error;
    }
  }

  async createFollow(follow: Omit<FollowDTO, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const newFollow = await prisma.follow.create({
        data: {
          followerId: follow.followerId,
          followingId: follow.followingId,
        },
      });
      return newFollow;
    } catch (error) {
      console.error('Error creating follow:', error);
      throw error;
    }
  }
}


export default new followService()