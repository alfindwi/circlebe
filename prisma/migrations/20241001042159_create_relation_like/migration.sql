/*
  Warnings:

  - You are about to drop the column `followingId` on the `Follow` table. All the data in the column will be lost.
  - You are about to drop the column `likes` on the `Reply` table. All the data in the column will be lost.
  - You are about to drop the column `likesCount` on the `Thread` table. All the data in the column will be lost.
  - You are about to drop the column `repliesCount` on the `Thread` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Follow" DROP CONSTRAINT "Follow_followerId_fkey";

-- DropForeignKey
ALTER TABLE "Follow" DROP CONSTRAINT "Follow_followingId_fkey";

-- DropIndex
DROP INDEX "Follow_followerId_followingId_key";

-- AlterTable
ALTER TABLE "Follow" DROP COLUMN "followingId",
ADD COLUMN     "followedId" INTEGER,
ALTER COLUMN "followerId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Reply" DROP COLUMN "likes";

-- AlterTable
ALTER TABLE "Thread" DROP COLUMN "likesCount",
DROP COLUMN "repliesCount";

-- CreateTable
CREATE TABLE "Like" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "threadId" INTEGER,
    "replyId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Thread"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "Reply"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followedId_fkey" FOREIGN KEY ("followedId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
