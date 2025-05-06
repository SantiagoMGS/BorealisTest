/*
  Warnings:

  - Made the column `cityId` on table `receptions` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "receptions" DROP CONSTRAINT "receptions_cityId_fkey";

-- AlterTable
ALTER TABLE "receptions" ALTER COLUMN "cityId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "receptions" ADD CONSTRAINT "receptions_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
