/*
  Warnings:

  - Added the required column `companyId` to the `analyses` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "analyses_analysisTypeId_idx";

-- DropIndex
DROP INDEX "analyses_sampleId_idx";

-- AlterTable
ALTER TABLE "analyses" ADD COLUMN     "companyId" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "analyses_companyId_idx" ON "analyses"("companyId");

-- CreateIndex
CREATE INDEX "analyses_companyId_sampleId_idx" ON "analyses"("companyId", "sampleId");

-- CreateIndex
CREATE INDEX "analyses_companyId_sampleId_analysisTypeId_idx" ON "analyses"("companyId", "sampleId", "analysisTypeId");

-- AddForeignKey
ALTER TABLE "analyses" ADD CONSTRAINT "analyses_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
