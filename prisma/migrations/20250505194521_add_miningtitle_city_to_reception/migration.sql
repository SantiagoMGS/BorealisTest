-- AlterTable
ALTER TABLE "receptions" ADD COLUMN     "cityId" UUID,
ADD COLUMN     "miningTitleId" UUID;

-- CreateIndex
CREATE INDEX "receptions_miningTitleId_idx" ON "receptions"("miningTitleId");

-- CreateIndex
CREATE INDEX "receptions_cityId_idx" ON "receptions"("cityId");

-- AddForeignKey
ALTER TABLE "receptions" ADD CONSTRAINT "receptions_miningTitleId_fkey" FOREIGN KEY ("miningTitleId") REFERENCES "supplier_mining_titles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receptions" ADD CONSTRAINT "receptions_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;
