-- CreateTable
CREATE TABLE "SampleRequiredAnalysis" (
    "id" UUID NOT NULL,
    "sampleId" UUID NOT NULL,
    "analysisTypeId" UUID NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SampleRequiredAnalysis_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SampleRequiredAnalysis" ADD CONSTRAINT "SampleRequiredAnalysis_sampleId_fkey" FOREIGN KEY ("sampleId") REFERENCES "samples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SampleRequiredAnalysis" ADD CONSTRAINT "SampleRequiredAnalysis_analysisTypeId_fkey" FOREIGN KEY ("analysisTypeId") REFERENCES "analysis_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;
