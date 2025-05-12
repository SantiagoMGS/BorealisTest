/*
  Warnings:

  - Added the required column `updatedAt` to the `samples` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "samples" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" UUID,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedBy" UUID;
