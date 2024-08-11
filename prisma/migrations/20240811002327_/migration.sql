/*
  Warnings:

  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Diagram" (
    "id" TEXT NOT NULL,
    "creatorUserId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "blobUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Diagram_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Diagram_creatorUserId_idx" ON "Diagram"("creatorUserId");

-- AddForeignKey
ALTER TABLE "Diagram" ADD CONSTRAINT "Diagram_creatorUserId_fkey" FOREIGN KEY ("creatorUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
