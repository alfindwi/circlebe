/*
  Warnings:

  - You are about to drop the column `followersId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `followingId` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "followersId",
DROP COLUMN "followingId";
