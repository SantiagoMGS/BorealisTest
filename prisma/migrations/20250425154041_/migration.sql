/*
  Warnings:

  - Added the required column `receptionOriginId` to the `reception_units` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "reception_units" ADD COLUMN     "receptionOriginId" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "reception_units_receptionOriginId_idx" ON "reception_units"("receptionOriginId");

-- AddForeignKey
ALTER TABLE "reception_units" ADD CONSTRAINT "reception_units_receptionOriginId_fkey" FOREIGN KEY ("receptionOriginId") REFERENCES "reception_origins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
