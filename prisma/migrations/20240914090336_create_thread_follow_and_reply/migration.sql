/*
  Warnings:

  - You are about to drop the column `followerId` on the `Follow` table. All the data in the column will be lost.
  - You are about to drop the column `followingId` on the `Follow` table. All the data in the column will be lost.
  - You are about to drop the column `threadId` on the `Reply` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Reply` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Thread` table. All the data in the column will be lost.
  - Added the required column `bio` to the `Follow` table without a default value. This is not possible if the table is not empty.
  - Added the required column `follow` to the `Follow` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `Follow` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Follow` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `Reply` table without a default value. This is not possible if the table is not empty.
  - Made the column `fullName` on table `User` required. This step will fail if there are existing NULL values in that column.

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
ALTER TABLE "Follow" DROP COLUMN "followerId",
DROP COLUMN "followingId",
ADD COLUMN     "bio" TEXT NOT NULL,
ADD COLUMN     "follow" BOOLEAN NOT NULL,
ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Reply" DROP COLUMN "threadId",
DROP COLUMN "userId",
ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Thread" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "fullName" SET NOT NULL;
