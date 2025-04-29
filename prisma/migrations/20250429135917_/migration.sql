-- CreateTable
CREATE TABLE "default_analysis_type_origins" (
    "receptionOriginId" UUID NOT NULL,
    "analysisTypeId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" UUID,
    "updatedBy" UUID,

    CONSTRAINT "default_analysis_type_origins_pkey" PRIMARY KEY ("receptionOriginId","analysisTypeId")
);

-- CreateIndex
CREATE INDEX "default_analysis_type_origins_receptionOriginId_idx" ON "default_analysis_type_origins"("receptionOriginId");

-- CreateIndex
CREATE INDEX "default_analysis_type_origins_analysisTypeId_idx" ON "default_analysis_type_origins"("analysisTypeId");

-- AddForeignKey
ALTER TABLE "default_analysis_type_origins" ADD CONSTRAINT "default_analysis_type_origins_receptionOriginId_fkey" FOREIGN KEY ("receptionOriginId") REFERENCES "reception_origins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "default_analysis_type_origins" ADD CONSTRAINT "default_analysis_type_origins_analysisTypeId_fkey" FOREIGN KEY ("analysisTypeId") REFERENCES "analysis_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;
