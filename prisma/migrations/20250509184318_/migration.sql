/*
  Warnings:

  - You are about to drop the column `subSampleId` on the `analyses` table. All the data in the column will be lost.
  - You are about to drop the `barrenados` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reception_type_sub_sample_types` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `sampleId` to the `analyses` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "analyses" DROP CONSTRAINT "analyses_subSampleId_fkey";

-- DropForeignKey
ALTER TABLE "barrenados" DROP CONSTRAINT "barrenados_SampleId_fkey";

-- DropForeignKey
ALTER TABLE "reception_type_sub_sample_types" DROP CONSTRAINT "reception_type_sub_sample_types_receptionTypeId_fkey";

-- DropForeignKey
ALTER TABLE "reception_type_sub_sample_types" DROP CONSTRAINT "reception_type_sub_sample_types_subSampleTypeId_fkey";

-- DropIndex
DROP INDEX "analyses_subSampleId_idx";

-- AlterTable
ALTER TABLE "analyses" DROP COLUMN "subSampleId",
ADD COLUMN     "sampleId" UUID NOT NULL;

-- DropTable
DROP TABLE "barrenados";

-- DropTable
DROP TABLE "reception_type_sub_sample_types";

-- CreateIndex
CREATE INDEX "analyses_sampleId_idx" ON "analyses"("sampleId");

-- AddForeignKey
ALTER TABLE "analyses" ADD CONSTRAINT "analyses_sampleId_fkey" FOREIGN KEY ("sampleId") REFERENCES "samples"("id") ON DELETE CASCADE ON UPDATE CASCADE;
