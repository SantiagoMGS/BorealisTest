/*
  Warnings:

  - A unique constraint covering the columns `[shortName]` on the table `reception_origins` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `shortName` to the `reception_origins` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "reception_origins" ADD COLUMN     "shortName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "reception_origins_shortName_key" ON "reception_origins"("shortName");
