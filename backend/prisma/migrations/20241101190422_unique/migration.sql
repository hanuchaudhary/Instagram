/*
  Warnings:

  - A unique constraint covering the columns `[userId,followId]` on the table `Followers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,followId]` on the table `Following` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Followers_userId_followId_key" ON "Followers"("userId", "followId");

-- CreateIndex
CREATE UNIQUE INDEX "Following_userId_followId_key" ON "Following"("userId", "followId");
