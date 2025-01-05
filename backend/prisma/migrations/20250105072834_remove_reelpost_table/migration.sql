/*
  Warnings:

  - You are about to drop the `ReelPost` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Reels` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ReelPost" DROP CONSTRAINT "ReelPost_postId_fkey";

-- DropForeignKey
ALTER TABLE "ReelPost" DROP CONSTRAINT "ReelPost_reelId_fkey";

-- DropForeignKey
ALTER TABLE "Reels" DROP CONSTRAINT "Reels_userId_fkey";

-- DropTable
DROP TABLE "ReelPost";

-- DropTable
DROP TABLE "Reels";

-- CreateTable
CREATE TABLE "Reel" (
    "id" SERIAL NOT NULL,
    "caption" TEXT NOT NULL,
    "mediaURL" TEXT,
    "postId" INTEGER NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Reel_postId_key" ON "Reel"("postId");

-- AddForeignKey
ALTER TABLE "Reel" ADD CONSTRAINT "Reel_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reel" ADD CONSTRAINT "Reel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
