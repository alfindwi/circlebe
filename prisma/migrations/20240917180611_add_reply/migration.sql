/*
  Warnings:

  - You are about to drop the column `fullName` on the `Reply` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Reply` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Reply` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reply" DROP COLUMN "fullName",
DROP COLUMN "username",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Reply" ADD CONSTRAINT "Reply_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
