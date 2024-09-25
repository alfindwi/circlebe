/*
  Warnings:

  - You are about to drop the column `avatar` on the `Follow` table. All the data in the column will be lost.
  - You are about to drop the column `bio` on the `Follow` table. All the data in the column will be lost.
  - You are about to drop the column `follow` on the `Follow` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `Follow` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Follow` table. All the data in the column will be lost.
  - You are about to drop the column `avatar` on the `Reply` table. All the data in the column will be lost.
  - You are about to drop the column `avatar` on the `Thread` table. All the data in the column will be lost.
  - You are about to drop the column `replies` on the `Thread` table. All the data in the column will be lost.
  - You are about to drop the `Followers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `followerId` to the `Follow` table without a default value. This is not possible if the table is not empty.
  - Added the required column `followingId` to the `Follow` table without a default value. This is not possible if the table is not empty.
  - Added the required column `threadId` to the `Reply` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Reply` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Thread` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Thread` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Follow" DROP COLUMN "avatar",
DROP COLUMN "bio",
DROP COLUMN "follow",
DROP COLUMN "fullName",
DROP COLUMN "username",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "followerId" INTEGER NOT NULL,
ADD COLUMN     "followingId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Reply" DROP COLUMN "avatar",
ADD COLUMN     "threadId" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Thread" DROP COLUMN "avatar",
DROP COLUMN "replies",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;

-- DropTable
DROP TABLE "Followers";

-- DropTable
DROP TABLE "Profile";

-- AddForeignKey
ALTER TABLE "Thread" ADD CONSTRAINT "Thread_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reply" ADD CONSTRAINT "Reply_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Thread"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
