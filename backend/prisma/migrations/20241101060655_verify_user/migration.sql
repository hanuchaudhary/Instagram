/*
  Warnings:

  - Added the required column `verifyCode` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `verifyCodeExpiry` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verifyCode" TEXT NOT NULL,
ADD COLUMN     "verifyCodeExpiry" TEXT NOT NULL;
