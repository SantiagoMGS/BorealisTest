/*
  Warnings:

  - You are about to drop the column `subSampleType` on the `sub_samples` table. All the data in the column will be lost.
  - Added the required column `subSampleTypeId` to the `sub_samples` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sub_samples" DROP COLUMN "subSampleType",
ADD COLUMN     "subSampleTypeId" UUID NOT NULL;

-- DropEnum
DROP TYPE "SubSampleType";

-- CreateTable
CREATE TABLE "reception_type_origins" (
    "receptionTypeId" UUID NOT NULL,
    "receptionOriginId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" UUID,
    "updatedBy" UUID,

    CONSTRAINT "reception_type_origins_pkey" PRIMARY KEY ("receptionTypeId","receptionOriginId")
);

-- CreateTable
CREATE TABLE "reception_type_sub_sample_types" (
    "receptionTypeId" UUID NOT NULL,
    "subSampleTypeId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" UUID,
    "updatedBy" UUID,

    CONSTRAINT "reception_type_sub_sample_types_pkey" PRIMARY KEY ("receptionTypeId","subSampleTypeId")
);

-- CreateTable
CREATE TABLE "sub_sample_types" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" UUID,
    "updatedBy" UUID,

    CONSTRAINT "sub_sample_types_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "reception_type_origins_receptionTypeId_idx" ON "reception_type_origins"("receptionTypeId");

-- CreateIndex
CREATE INDEX "reception_type_origins_receptionOriginId_idx" ON "reception_type_origins"("receptionOriginId");

-- CreateIndex
CREATE INDEX "reception_type_sub_sample_types_receptionTypeId_idx" ON "reception_type_sub_sample_types"("receptionTypeId");

-- CreateIndex
CREATE INDEX "reception_type_sub_sample_types_subSampleTypeId_idx" ON "reception_type_sub_sample_types"("subSampleTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "sub_sample_types_name_key" ON "sub_sample_types"("name");

-- CreateIndex
CREATE INDEX "sub_sample_types_name_idx" ON "sub_sample_types"("name");

-- AddForeignKey
ALTER TABLE "reception_type_origins" ADD CONSTRAINT "reception_type_origins_receptionTypeId_fkey" FOREIGN KEY ("receptionTypeId") REFERENCES "reception_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reception_type_origins" ADD CONSTRAINT "reception_type_origins_receptionOriginId_fkey" FOREIGN KEY ("receptionOriginId") REFERENCES "reception_origins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reception_type_sub_sample_types" ADD CONSTRAINT "reception_type_sub_sample_types_receptionTypeId_fkey" FOREIGN KEY ("receptionTypeId") REFERENCES "reception_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reception_type_sub_sample_types" ADD CONSTRAINT "reception_type_sub_sample_types_subSampleTypeId_fkey" FOREIGN KEY ("subSampleTypeId") REFERENCES "sub_sample_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_samples" ADD CONSTRAINT "sub_samples_subSampleTypeId_fkey" FOREIGN KEY ("subSampleTypeId") REFERENCES "sub_sample_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
