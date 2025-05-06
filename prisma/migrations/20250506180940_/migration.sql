/*
  Warnings:

  - You are about to alter the column `shortName` on the `suppliers` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(6)`.

*/
-- AlterTable
ALTER TABLE "suppliers" ALTER COLUMN "shortName" SET DATA TYPE CHAR(6);
