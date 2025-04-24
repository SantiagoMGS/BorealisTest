/*
  Warnings:

  - Added the required column `verificationDigit` to the `suppliers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "suppliers" ADD COLUMN     "verificationDigit" TEXT NOT NULL;
