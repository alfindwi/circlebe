-- CreateTable
CREATE TABLE "Followers" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "follow" BOOLEAN NOT NULL,
    "avatar" TEXT NOT NULL,

    CONSTRAINT "Followers_pkey" PRIMARY KEY ("id")
);
