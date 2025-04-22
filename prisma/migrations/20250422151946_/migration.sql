/*
  Warnings:

  - A unique constraint covering the columns `[documentNumber]` on the table `suppliers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "suppliers_documentNumber_key" ON "suppliers"("documentNumber");
