-- CreateTable
CREATE TABLE "printers" (
    "id" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "ip" TEXT NOT NULL,
    "port" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "printerName" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" UUID,
    "updatedBy" UUID,

    CONSTRAINT "printers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sample_printer_traces" (
    "id" UUID NOT NULL,
    "sampleId" UUID NOT NULL,
    "printerId" UUID NOT NULL,
    "count" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sample_printer_traces_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "printers_companyId_idx" ON "printers"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "printers_companyId_ip_key" ON "printers"("companyId", "ip");

-- CreateIndex
CREATE INDEX "sample_printer_traces_sampleId_idx" ON "sample_printer_traces"("sampleId");

-- AddForeignKey
ALTER TABLE "printers" ADD CONSTRAINT "printers_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sample_printer_traces" ADD CONSTRAINT "sample_printer_traces_sampleId_fkey" FOREIGN KEY ("sampleId") REFERENCES "samples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sample_printer_traces" ADD CONSTRAINT "sample_printer_traces_printerId_fkey" FOREIGN KEY ("printerId") REFERENCES "printers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
