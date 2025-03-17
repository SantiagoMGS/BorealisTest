/*
  Warnings:

  - A unique constraint covering the columns `[name,resourceId]` on the table `Subresource` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Subresource_name_resourceId_key" ON "Subresource"("name", "resourceId");
