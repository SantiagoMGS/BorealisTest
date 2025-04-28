/*
  Warnings:

  - You are about to drop the `reception_units` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "barrenados" DROP CONSTRAINT "barrenados_SampleId_fkey";

-- DropForeignKey
ALTER TABLE "reception_units" DROP CONSTRAINT "reception_units_receptionId_fkey";

-- DropForeignKey
ALTER TABLE "reception_units" DROP CONSTRAINT "reception_units_receptionOriginId_fkey";

-- DropForeignKey
ALTER TABLE "sub_samples" DROP CONSTRAINT "sub_samples_SampleId_fkey";

-- DropTable
DROP TABLE "reception_units";

-- CreateTable
CREATE TABLE "samples" (
    "id" UUID NOT NULL,
    "receptionId" UUID NOT NULL,
    "receptionOriginId" UUID NOT NULL,
    "receivedWeight" DECIMAL(65,30) NOT NULL,
    "dryWeight" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "samples_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "samples_receptionId_idx" ON "samples"("receptionId");

-- CreateIndex
CREATE INDEX "samples_receptionOriginId_idx" ON "samples"("receptionOriginId");

-- AddForeignKey
ALTER TABLE "samples" ADD CONSTRAINT "samples_receptionId_fkey" FOREIGN KEY ("receptionId") REFERENCES "receptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "samples" ADD CONSTRAINT "samples_receptionOriginId_fkey" FOREIGN KEY ("receptionOriginId") REFERENCES "reception_origins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_samples" ADD CONSTRAINT "sub_samples_SampleId_fkey" FOREIGN KEY ("SampleId") REFERENCES "samples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "barrenados" ADD CONSTRAINT "barrenados_SampleId_fkey" FOREIGN KEY ("SampleId") REFERENCES "samples"("id") ON DELETE CASCADE ON UPDATE CASCADE;
