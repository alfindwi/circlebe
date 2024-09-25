/*
  Warnings:

  - You are about to drop the `threads` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "threads" DROP CONSTRAINT "threads_userId_fkey";

-- DropTable
DROP TABLE "threads";

-- CreateTable
CREATE TABLE "Thread" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "image" TEXT,
    "likesCount" INTEGER NOT NULL DEFAULT 0,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Thread_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Thread" ADD CONSTRAINT "Thread_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reply" ADD CONSTRAINT "Reply_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Thread"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
