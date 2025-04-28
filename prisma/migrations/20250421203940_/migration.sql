-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('NIT', 'NIT_EXTERIOR', 'PASAPORTE', 'CEDULA_DE_CIUDADANIA', 'CEDULA_DE_EXTRANJERIA');

-- CreateEnum
CREATE TYPE "ReceptionType" AS ENUM ('DORE', 'MUESTRAS', 'MINERAL', 'CONCENTRADO');

-- CreateEnum
CREATE TYPE "ReceptionOrigin" AS ENUM ('CABEZA', 'COLA', 'SECADO', 'JOYERIA', 'SUBSISTENCIA', 'VETA_FUNDIDO', 'MINERAL', 'CONCENTRADO');

-- CreateEnum
CREATE TYPE "SubSampleType" AS ENUM ('MPL', 'MPR', 'MPA', 'CUSTODIA', 'BARRENADO');

-- CreateTable
CREATE TABLE "Supplier" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "documentType" "DocumentType" NOT NULL,
    "documentNumber" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" UUID,
    "updatedBy" UUID,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanySupplier" (
    "companyId" UUID NOT NULL,
    "supplierId" UUID NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" UUID,
    "updatedBy" UUID,

    CONSTRAINT "CompanySupplier_pkey" PRIMARY KEY ("companyId","supplierId")
);

-- CreateTable
CREATE TABLE "Reception" (
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

    CONSTRAINT "Reception_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sample" (
    "id" UUID NOT NULL,
    "receptionId" UUID NOT NULL,
    "recievedWeight" DECIMAL(65,30) NOT NULL,
    "dryWeight" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Sample_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubSample" (
    "id" UUID NOT NULL,
    "SampleId" UUID NOT NULL,
    "subSampleType" "SubSampleType" NOT NULL,
    "weight" DECIMAL(65,30) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" UUID,
    "updatedBy" UUID,

    CONSTRAINT "SubSample_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Barrenado" (
    "id" UUID NOT NULL,
    "SampleId" UUID NOT NULL,
    "totalWeight" DECIMAL(65,30) NOT NULL,
    "balanceWeight" DECIMAL(65,30) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" UUID,
    "updatedBy" UUID,

    CONSTRAINT "Barrenado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalysisType" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "resultSchema" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "AnalysisType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Analysis" (
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

    CONSTRAINT "Analysis_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CompanySupplier" ADD CONSTRAINT "CompanySupplier_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanySupplier" ADD CONSTRAINT "CompanySupplier_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reception" ADD CONSTRAINT "Reception_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reception" ADD CONSTRAINT "Reception_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sample" ADD CONSTRAINT "Sample_receptionId_fkey" FOREIGN KEY ("receptionId") REFERENCES "Reception"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubSample" ADD CONSTRAINT "SubSample_SampleId_fkey" FOREIGN KEY ("SampleId") REFERENCES "Sample"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Barrenado" ADD CONSTRAINT "Barrenado_SampleId_fkey" FOREIGN KEY ("SampleId") REFERENCES "Sample"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Analysis" ADD CONSTRAINT "Analysis_analysisTypeId_fkey" FOREIGN KEY ("analysisTypeId") REFERENCES "AnalysisType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Analysis" ADD CONSTRAINT "Analysis_subSampleId_fkey" FOREIGN KEY ("subSampleId") REFERENCES "SubSample"("id") ON DELETE CASCADE ON UPDATE CASCADE;
