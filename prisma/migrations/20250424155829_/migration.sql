/*
  Warnings:

  - The primary key for the `company_suppliers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `id` was added to the `company_suppliers` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "company_suppliers_companyId_supplierId_key";

-- AlterTable
ALTER TABLE "company_suppliers" DROP CONSTRAINT "company_suppliers_pkey",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "company_suppliers_pkey" PRIMARY KEY ("id");
