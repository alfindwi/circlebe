-- AlterTable
ALTER TABLE "Follow" ALTER COLUMN "followerId" SET DEFAULT 0,
ALTER COLUMN "followingId" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "followersCount" INTEGER,
ADD COLUMN     "followingCount" INTEGER;
