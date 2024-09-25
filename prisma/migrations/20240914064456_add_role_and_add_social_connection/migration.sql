-- CreateEnum
CREATE TYPE "SocialConnection" AS ENUM ('GOOGLE', 'GITHUB', 'FACEBOOK');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "socialConnection" "SocialConnection";
