-- CreateTable
CREATE TABLE "lote" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "companyId" UUID NOT NULL,
    "supplierId" UUID NOT NULL,
    "tipoLoteId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipoLote" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tipoLote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "lote_name_key" ON "lote"("name");

-- CreateIndex
CREATE UNIQUE INDEX "lote_reference_key" ON "lote"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "tipoLote_name_key" ON "tipoLote"("name");

-- AddForeignKey
ALTER TABLE "lote" ADD CONSTRAINT "lote_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lote" ADD CONSTRAINT "lote_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lote" ADD CONSTRAINT "lote_tipoLoteId_fkey" FOREIGN KEY ("tipoLoteId") REFERENCES "tipoLote"("id") ON DELETE CASCADE ON UPDATE CASCADE;
