-- CreateEnum
CREATE TYPE "mediaType" AS ENUM ('image', 'video');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "mediaType" "mediaType" NOT NULL DEFAULT 'image';
