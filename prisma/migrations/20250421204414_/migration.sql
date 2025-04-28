/*
  Warnings:

  - You are about to drop the `Analysis` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnalysisType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Barrenado` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CompanySupplier` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Reception` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Sample` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubSample` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Supplier` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Analysis" DROP CONSTRAINT "Analysis_analysisTypeId_fkey";

-- DropForeignKey
ALTER TABLE "Analysis" DROP CONSTRAINT "Analysis_subSampleId_fkey";

-- DropForeignKey
ALTER TABLE "Barrenado" DROP CONSTRAINT "Barrenado_SampleId_fkey";

-- DropForeignKey
ALTER TABLE "CompanySupplier" DROP CONSTRAINT "CompanySupplier_companyId_fkey";

-- DropForeignKey
ALTER TABLE "CompanySupplier" DROP CONSTRAINT "CompanySupplier_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "Reception" DROP CONSTRAINT "Reception_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Reception" DROP CONSTRAINT "Reception_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "Sample" DROP CONSTRAINT "Sample_receptionId_fkey";

-- DropForeignKey
ALTER TABLE "SubSample" DROP CONSTRAINT "SubSample_SampleId_fkey";

-- DropTable
DROP TABLE "Analysis";

-- DropTable
DROP TABLE "AnalysisType";

-- DropTable
DROP TABLE "Barrenado";

-- DropTable
DROP TABLE "CompanySupplier";

-- DropTable
DROP TABLE "Reception";

-- DropTable
DROP TABLE "Sample";

-- DropTable
DROP TABLE "SubSample";

-- DropTable
DROP TABLE "Supplier";

-- CreateTable
CREATE TABLE "suppliers" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "documentType" "DocumentType" NOT NULL,
    "documentNumber" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" UUID,
    "updatedBy" UUID,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_suppliers" (
    "companyId" UUID NOT NULL,
    "supplierId" UUID NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" UUID,
    "updatedBy" UUID,

    CONSTRAINT "company_suppliers_pkey" PRIMARY KEY ("companyId","supplierId")
);

-- CreateTable
CREATE TABLE "receptions" (
    "id" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "supplierId" UUID NOT NULL,
    "receptionType" "ReceptionType" NOT NULL,
    "receptionOrigin" "ReceptionOrigin" NOT NULL,
    "receptionDate" TIMESTAMP(3) NOT NULL,
    "batchNumber" TEXT,
    "observation" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" UUID,
    "updatedBy" UUID,

    CONSTRAINT "receptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reception_units" (
    "id" UUID NOT NULL,
    "receptionId" UUID NOT NULL,
    "receivedWeight" DECIMAL(65,30) NOT NULL,
    "dryWeight" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "reception_units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sub_samples" (
    "id" UUID NOT NULL,
    "SampleId" UUID NOT NULL,
    "subSampleType" "SubSampleType" NOT NULL,
    "weight" DECIMAL(65,30) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" UUID,
    "updatedBy" UUID,

    CONSTRAINT "sub_samples_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "barrenados" (
    "id" UUID NOT NULL,
    "SampleId" UUID NOT NULL,
    "totalWeight" DECIMAL(65,30) NOT NULL,
    "balanceWeight" DECIMAL(65,30) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" UUID,
    "updatedBy" UUID,

    CONSTRAINT "barrenados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analysis_types" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "resultSchema" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "analysis_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analyses" (
    "id" UUID NOT NULL,
    "analysisTypeId" UUID NOT NULL,
    "subSampleId" UUID NOT NULL,
    "resultValue" JSONB NOT NULL,
    "analysisDate" TIMESTAMP(3) NOT NULL,
    "analysisResult" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" UUID,
    "updatedBy" UUID,

    CONSTRAINT "analyses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "suppliers_documentNumber_idx" ON "suppliers"("documentNumber");

-- CreateIndex
CREATE INDEX "suppliers_name_idx" ON "suppliers"("name");

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_documentNumber_name_key" ON "suppliers"("documentNumber", "name");

-- CreateIndex
CREATE INDEX "company_suppliers_companyId_idx" ON "company_suppliers"("companyId");

-- CreateIndex
CREATE INDEX "company_suppliers_supplierId_idx" ON "company_suppliers"("supplierId");

-- CreateIndex
CREATE UNIQUE INDEX "company_suppliers_companyId_supplierId_key" ON "company_suppliers"("companyId", "supplierId");

-- CreateIndex
CREATE INDEX "receptions_companyId_idx" ON "receptions"("companyId");

-- CreateIndex
CREATE INDEX "receptions_supplierId_idx" ON "receptions"("supplierId");

-- CreateIndex
CREATE INDEX "reception_units_receptionId_idx" ON "reception_units"("receptionId");

-- CreateIndex
CREATE INDEX "sub_samples_SampleId_idx" ON "sub_samples"("SampleId");

-- CreateIndex
CREATE INDEX "barrenados_SampleId_idx" ON "barrenados"("SampleId");

-- CreateIndex
CREATE UNIQUE INDEX "analysis_types_name_key" ON "analysis_types"("name");

-- CreateIndex
CREATE INDEX "analysis_types_name_idx" ON "analysis_types"("name");

-- CreateIndex
CREATE INDEX "analyses_analysisTypeId_idx" ON "analyses"("analysisTypeId");

-- CreateIndex
CREATE INDEX "analyses_subSampleId_idx" ON "analyses"("subSampleId");

-- AddForeignKey
ALTER TABLE "company_suppliers" ADD CONSTRAINT "company_suppliers_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_suppliers" ADD CONSTRAINT "company_suppliers_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receptions" ADD CONSTRAINT "receptions_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receptions" ADD CONSTRAINT "receptions_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reception_units" ADD CONSTRAINT "reception_units_receptionId_fkey" FOREIGN KEY ("receptionId") REFERENCES "receptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_samples" ADD CONSTRAINT "sub_samples_SampleId_fkey" FOREIGN KEY ("SampleId") REFERENCES "reception_units"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "barrenados" ADD CONSTRAINT "barrenados_SampleId_fkey" FOREIGN KEY ("SampleId") REFERENCES "reception_units"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analyses" ADD CONSTRAINT "analyses_analysisTypeId_fkey" FOREIGN KEY ("analysisTypeId") REFERENCES "analysis_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analyses" ADD CONSTRAINT "analyses_subSampleId_fkey" FOREIGN KEY ("subSampleId") REFERENCES "sub_samples"("id") ON DELETE CASCADE ON UPDATE CASCADE;
