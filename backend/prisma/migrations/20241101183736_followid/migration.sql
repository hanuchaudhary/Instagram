/*
  Warnings:

  - Added the required column `followId` to the `Followers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `followId` to the `Following` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Followers" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "followId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Following" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "followId" TEXT NOT NULL;
