/*
  Warnings:

  - A unique constraint covering the columns `[shortName]` on the table `analysis_types` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `shortName` to the `analysis_types` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "analysis_types" ADD COLUMN     "shortName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "analysis_types_shortName_key" ON "analysis_types"("shortName");

-- CreateIndex
CREATE INDEX "analysis_types_shortName_idx" ON "analysis_types"("shortName");
