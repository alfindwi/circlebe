/*
  Warnings:

  - A unique constraint covering the columns `[followerId,followingId]` on the table `Follow` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Follow" ALTER COLUMN "followerId" DROP DEFAULT,
ALTER COLUMN "followingId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "followersId" INTEGER,
ADD COLUMN     "followingId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Follow_followerId_followingId_key" ON "Follow"("followerId", "followingId");
