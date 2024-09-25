/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updateAt` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RoleEnum" AS ENUM ('ADMIN', 'MEMBER');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "role" "RoleEnum" NOT NULL DEFAULT 'MEMBER',
ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "Post";
