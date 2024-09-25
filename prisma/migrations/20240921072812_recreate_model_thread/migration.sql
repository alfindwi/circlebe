/*
  Warnings:

  - You are about to drop the `Thread` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Reply" DROP CONSTRAINT "Reply_threadId_fkey";

-- DropForeignKey
ALTER TABLE "Thread" DROP CONSTRAINT "Thread_userId_fkey";

-- DropTable
DROP TABLE "Thread";

-- CreateTable
CREATE TABLE "threads" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "image" TEXT,
    "likesCount" INTEGER NOT NULL DEFAULT 0,
    "repliesCount" INTEGER NOT NULL DEFAULT 0,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "threads_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "threads" ADD CONSTRAINT "threads_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
