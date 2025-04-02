/*
  Warnings:

  - You are about to drop the `lote` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tipoLote` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "lote" DROP CONSTRAINT "lote_companyId_fkey";

-- DropForeignKey
ALTER TABLE "lote" DROP CONSTRAINT "lote_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "lote" DROP CONSTRAINT "lote_tipoLoteId_fkey";

-- DropTable
DROP TABLE "lote";

-- DropTable
DROP TABLE "tipoLote";

-- CreateTable
CREATE TABLE "Lote" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "companyId" UUID NOT NULL,
    "supplierId" UUID NOT NULL,
    "tipoLoteId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoteType" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LoteType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sample" (
    "id" UUID NOT NULL,
    "initialWeight" TEXT NOT NULL,
    "finalWeight" TEXT NOT NULL,
    "loteId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sample_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "preparation" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "schema" TEXT NOT NULL,
    "preparationTypeId" UUID NOT NULL,
    "sampleId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "preparation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "preparationType" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "preparationType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lote_name_key" ON "Lote"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Lote_reference_key" ON "Lote"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "LoteType_name_key" ON "LoteType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "preparationType_name_key" ON "preparationType"("name");

-- AddForeignKey
ALTER TABLE "Lote" ADD CONSTRAINT "Lote_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lote" ADD CONSTRAINT "Lote_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lote" ADD CONSTRAINT "Lote_tipoLoteId_fkey" FOREIGN KEY ("tipoLoteId") REFERENCES "LoteType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sample" ADD CONSTRAINT "Sample_loteId_fkey" FOREIGN KEY ("loteId") REFERENCES "Lote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "preparation" ADD CONSTRAINT "preparation_preparationTypeId_fkey" FOREIGN KEY ("preparationTypeId") REFERENCES "preparationType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "preparation" ADD CONSTRAINT "preparation_sampleId_fkey" FOREIGN KEY ("sampleId") REFERENCES "Sample"("id") ON DELETE CASCADE ON UPDATE CASCADE;
