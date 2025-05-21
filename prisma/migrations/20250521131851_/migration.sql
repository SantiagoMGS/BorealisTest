/*
  Warnings:

  - You are about to drop the `SampleRequiredAnalysis` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SampleRequiredAnalysis" DROP CONSTRAINT "SampleRequiredAnalysis_analysisTypeId_fkey";

-- DropForeignKey
ALTER TABLE "SampleRequiredAnalysis" DROP CONSTRAINT "SampleRequiredAnalysis_sampleId_fkey";

-- DropTable
DROP TABLE "SampleRequiredAnalysis";

-- CreateTable
CREATE TABLE "sample_required_analyses" (
    "id" UUID NOT NULL,
    "sampleId" UUID NOT NULL,
    "analysisTypeId" UUID NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "sample_required_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "sample_required_analyses_sampleId_idx" ON "sample_required_analyses"("sampleId");

-- CreateIndex
CREATE INDEX "sample_required_analyses_analysisTypeId_idx" ON "sample_required_analyses"("analysisTypeId");

-- AddForeignKey
ALTER TABLE "sample_required_analyses" ADD CONSTRAINT "sample_required_analyses_sampleId_fkey" FOREIGN KEY ("sampleId") REFERENCES "samples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sample_required_analyses" ADD CONSTRAINT "sample_required_analyses_analysisTypeId_fkey" FOREIGN KEY ("analysisTypeId") REFERENCES "analysis_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;
