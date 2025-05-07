-- DropForeignKey
ALTER TABLE "receptions" DROP CONSTRAINT "receptions_cityId_fkey";

-- AlterTable
ALTER TABLE "receptions" ALTER COLUMN "cityId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "receptions" ADD CONSTRAINT "receptions_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;
