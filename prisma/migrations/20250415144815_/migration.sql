/*
  Warnings:

  - A unique constraint covering the columns `[roleId,subresourceId]` on the table `role_permissions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "resources_icon_key";

-- DropIndex
DROP INDEX "subresources_icon_key";

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_roleId_subresourceId_key" ON "role_permissions"("roleId", "subresourceId");
