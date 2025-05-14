/*
  Warnings:

  - You are about to drop the column `companyId` on the `analyses` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "analyses" DROP CONSTRAINT "analyses_companyId_fkey";

-- DropIndex
DROP INDEX "analyses_companyId_idx";

-- DropIndex
DROP INDEX "analyses_companyId_sampleId_analysisTypeId_idx";

-- DropIndex
DROP INDEX "analyses_companyId_sampleId_idx";

-- AlterTable
ALTER TABLE "analyses" DROP COLUMN "companyId";

-- CreateIndex
CREATE INDEX "analyses_sampleId_idx" ON "analyses"("sampleId");

-- CreateIndex
CREATE INDEX "analyses_sampleId_analysisTypeId_idx" ON "analyses"("sampleId", "analysisTypeId");
