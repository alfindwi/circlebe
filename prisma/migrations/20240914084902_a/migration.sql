/*
  Warnings:

  - You are about to drop the column `username` on the `Thread` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Thread" DROP COLUMN "username";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "username";
