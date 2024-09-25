/*
  Warnings:

  - You are about to drop the column `userId` on the `Thread` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Thread" DROP CONSTRAINT "Thread_userId_fkey";

-- AlterTable
ALTER TABLE "Thread" DROP COLUMN "userId";
