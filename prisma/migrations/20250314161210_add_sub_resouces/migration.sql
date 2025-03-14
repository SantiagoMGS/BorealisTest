/*
  Warnings:

  - The primary key for the `RolePermission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `resourceId` on the `RolePermission` table. All the data in the column will be lost.
  - Added the required column `subresourceId` to the `RolePermission` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_resourceId_fkey";

-- AlterTable
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_pkey",
DROP COLUMN "resourceId",
ADD COLUMN     "subresourceId" UUID NOT NULL,
ADD CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("roleId", "actionId", "subresourceId");

-- AlterTable
ALTER TABLE "Subresource" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_subresourceId_fkey" FOREIGN KEY ("subresourceId") REFERENCES "Subresource"("id") ON DELETE CASCADE ON UPDATE CASCADE;
