/*
  Warnings:

  - You are about to drop the column `threadId` on the `Reply` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Reply` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Thread` table. All the data in the column will be lost.
  - You are about to drop the `Follow` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `fullName` to the `Thread` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Follow" DROP CONSTRAINT "Follow_followerId_fkey";

-- DropForeignKey
ALTER TABLE "Follow" DROP CONSTRAINT "Follow_followingId_fkey";

-- DropForeignKey
ALTER TABLE "Reply" DROP CONSTRAINT "Reply_threadId_fkey";

-- DropForeignKey
ALTER TABLE "Reply" DROP CONSTRAINT "Reply_userId_fkey";

-- DropForeignKey
ALTER TABLE "Thread" DROP CONSTRAINT "Thread_userId_fkey";

-- AlterTable
ALTER TABLE "Reply" DROP COLUMN "threadId",
DROP COLUMN "userId",
ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Thread" DROP COLUMN "userId",
ADD COLUMN     "fullName" TEXT NOT NULL;

-- DropTable
DROP TABLE "Follow";
