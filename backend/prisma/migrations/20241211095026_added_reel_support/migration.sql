-- CreateTable
CREATE TABLE "Reels" (
    "id" SERIAL NOT NULL,
    "caption" TEXT NOT NULL,
    "mediaURL" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reels_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Reels_id_key" ON "Reels"("id");

-- AddForeignKey
ALTER TABLE "Reels" ADD CONSTRAINT "Reels_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
