/*
  Warnings:

  - Added the required column `receptionId` to the `dore` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "dore" ADD COLUMN     "receptionId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "dore" ADD CONSTRAINT "dore_receptionId_fkey" FOREIGN KEY ("receptionId") REFERENCES "receptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
