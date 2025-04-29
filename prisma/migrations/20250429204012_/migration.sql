/*
  Warnings:

  - The `verificationDigit` column on the `suppliers` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "suppliers" DROP COLUMN "verificationDigit",
ADD COLUMN     "verificationDigit" INTEGER;
