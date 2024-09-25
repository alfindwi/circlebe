/*
  Warnings:

  - You are about to drop the column `likes` on the `Thread` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Thread" DROP COLUMN "likes",
ADD COLUMN     "likesCount" INTEGER NOT NULL DEFAULT 0;
