-- DropIndex
DROP INDEX "Follow_followerId_followingId_key";

-- AlterTable
ALTER TABLE "Follow" ALTER COLUMN "followerId" SET DEFAULT 0,
ALTER COLUMN "followingId" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "socialConnection" DROP NOT NULL;
