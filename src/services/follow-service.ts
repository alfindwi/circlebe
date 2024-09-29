import { PrismaClient } from "@prisma/client";
import { CreateFollowDTO } from "../dto/follow-dto";

const prisma = new PrismaClient();

class FollowService {
  async createFollow(followerId: number, followingId: number) {
    try {
      // Validasi apakah followerId dan followingId ada di database
      const [followerExists, followingExists] = await Promise.all([
        prisma.user.findUnique({ where: { id: followerId } }),
        prisma.user.findUnique({ where: { id: followingId } }),
      ]);
  
      if (!followerExists || !followingExists) {
        throw new Error("Invalid followerId or followingId: User not found");
      }
  
      // Cek apakah user sudah di-follow sebelumnya
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
  
      // Buat record follow baru di tabel follow
      const follow = await prisma.follow.create({
        data: {
          followerId: followerId,
          followingId: followingId,
        },
      });
  
      console.log(`New follow created: ${JSON.stringify(follow)}`);
  
        // await Promise.all([
        //   prisma.user.update({
        //     where: { id: followerId },
        //     data: {
        //       following: {
        //         connect: { id: followingId },
        //       },
        //     },
        //   }),
        //   prisma.user.update({
        //     where: { id: followingId },
        //     data: {
        //       followers: {
        //         connect: { id: followerId },
        //       },
        //     },
        //   }),
        // ]);
  
      return follow;
    } catch (error) {
      console.error("Error in createFollow:", (error as any).message); // Tambahkan log detail error
      throw error; // Tetap lempar error agar ditangani di controller
    }
  }
  


  

  async unfollowUser(followerId: number, followingId: number): Promise<void> {
    await prisma.follow.deleteMany({
      where: {
        followerId,
        followingId,
      },
    });
  }

  async getFollowers(userId: number): Promise<CreateFollowDTO[]> {
    return await prisma.follow.findMany({
      where: {
        followingId: userId,
      },
      include: {
        follower: true, // Menyertakan data pengguna yang mengikuti
      },
    }) as CreateFollowDTO[];
  }

  async getFollowing(userId: number): Promise<CreateFollowDTO[]> {
    return await prisma.follow.findMany({
      where: {
        followerId: userId,
      },
      include: {
        following: true, // Menyertakan data pengguna yang diikuti
      },
    }) as CreateFollowDTO[];
  }
}

export default new FollowService(); // Ekspor sebagai singleton
