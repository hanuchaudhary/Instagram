/*
  Warnings:

  - You are about to drop the column `isVerified` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('admin', 'user');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isVerified",
ADD COLUMN     "isCodeVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isVerifiedAccount" BOOLEAN NOT NULL DEFAULT false;
