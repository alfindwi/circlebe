import { PrismaClient, Follow } from "@prisma/client";

const prisma = new PrismaClient();

class FollowService {
  // Mengembalikan array yang berisi data follower tanpa menggunakan FollowDTO
  async getFollowersByUserId(userId: number): Promise<any[]> { // Sesuaikan tipe return sesuai kebutuhan Anda
    const followers = await prisma.follow.findMany({
      where: {
        followingId: userId, // Pastikan userId sudah bertipe number
      },
      include: {
        follower: {
          select: {
            id: true,
            fullName: true,
            username: true,
            bio: true,
            image: true,
          },
        },
      },
    });

    // Mapping ke objek yang diinginkan
    return followers.map(follow => ({
      id: follow.follower.id,
      fullName: follow.follower.fullName,
      username: follow.follower.username,
      bio: follow.follower.bio,
      image: follow.follower.image,
    }));
  }
}

export default new FollowService();
