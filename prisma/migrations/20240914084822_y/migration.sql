/*
  Warnings:

  - You are about to drop the column `likes` on the `Reply` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `Thread` table. All the data in the column will be lost.
  - Added the required column `threadId` to the `Reply` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Reply` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Thread` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reply" DROP COLUMN "likes",
ADD COLUMN     "threadId" INTEGER NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Thread" DROP COLUMN "fullName",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Follow" (
    "id" SERIAL NOT NULL,
    "followerId" INTEGER NOT NULL,
    "followingId" INTEGER NOT NULL,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Thread" ADD CONSTRAINT "Thread_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reply" ADD CONSTRAINT "Reply_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Thread"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reply" ADD CONSTRAINT "Reply_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
