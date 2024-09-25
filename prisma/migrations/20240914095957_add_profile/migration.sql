/*
  Warnings:

  - Added the required column `avatar` to the `Follow` table without a default value. This is not possible if the table is not empty.
  - Added the required column `avatar` to the `Reply` table without a default value. This is not possible if the table is not empty.
  - Added the required column `avatar` to the `Thread` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Follow" ADD COLUMN     "avatar" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Reply" ADD COLUMN     "avatar" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Thread" ADD COLUMN     "avatar" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "follow" INTEGER NOT NULL,
    "following" INTEGER NOT NULL,
    "avatar" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "image" TEXT,
    "Like" INTEGER NOT NULL DEFAULT 0,
    "replies" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);
