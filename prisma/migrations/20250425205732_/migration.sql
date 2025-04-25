/*
  Warnings:

  - A unique constraint covering the columns `[shortName]` on the table `suppliers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `shortName` to the `suppliers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "suppliers" ADD COLUMN     "shortName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_shortName_key" ON "suppliers"("shortName");
