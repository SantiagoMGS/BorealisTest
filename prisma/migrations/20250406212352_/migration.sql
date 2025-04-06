/*
  Warnings:

  - A unique constraint covering the columns `[shortName]` on the table `companies` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "companies_shortName_key" ON "companies"("shortName");
