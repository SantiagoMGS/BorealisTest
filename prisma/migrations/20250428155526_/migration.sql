/*
  Warnings:

  - A unique constraint covering the columns `[name,daneCode,departmentId]` on the table `cities` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "mineType" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "royalty_percentage" DECIMAL(7,4) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "mineType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplier_mining_titles" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "supplierId" UUID NOT NULL,
    "mineTypeId" UUID NOT NULL,
    "cityId" UUID NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "supplier_mining_titles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mineType_name_key" ON "mineType"("name");

-- CreateIndex
CREATE INDEX "mineType_name_idx" ON "mineType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "supplier_mining_titles_name_key" ON "supplier_mining_titles"("name");

-- CreateIndex
CREATE INDEX "supplier_mining_titles_supplierId_idx" ON "supplier_mining_titles"("supplierId");

-- CreateIndex
CREATE INDEX "supplier_mining_titles_mineTypeId_idx" ON "supplier_mining_titles"("mineTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "cities_name_daneCode_departmentId_key" ON "cities"("name", "daneCode", "departmentId");

-- AddForeignKey
ALTER TABLE "supplier_mining_titles" ADD CONSTRAINT "supplier_mining_titles_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_mining_titles" ADD CONSTRAINT "supplier_mining_titles_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_mining_titles" ADD CONSTRAINT "supplier_mining_titles_mineTypeId_fkey" FOREIGN KEY ("mineTypeId") REFERENCES "mineType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
