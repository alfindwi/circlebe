-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "content" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);
