-- CreateTable
CREATE TABLE "supplier_reception_origins" (
    "id" UUID NOT NULL,
    "supplierId" UUID NOT NULL,
    "originId" UUID NOT NULL,

    CONSTRAINT "supplier_reception_origins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "supplier_reception_origins_supplierId_idx" ON "supplier_reception_origins"("supplierId");

-- CreateIndex
CREATE INDEX "supplier_reception_origins_originId_idx" ON "supplier_reception_origins"("originId");

-- AddForeignKey
ALTER TABLE "supplier_reception_origins" ADD CONSTRAINT "supplier_reception_origins_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_reception_origins" ADD CONSTRAINT "supplier_reception_origins_originId_fkey" FOREIGN KEY ("originId") REFERENCES "reception_origins"("id") ON DELETE CASCADE ON UPDATE CASCADE;
