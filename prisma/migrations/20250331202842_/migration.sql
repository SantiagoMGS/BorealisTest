/*
  Warnings:

  - You are about to drop the `_SuppliersCompanies` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_SuppliersCompanies" DROP CONSTRAINT "_SuppliersCompanies_A_fkey";

-- DropForeignKey
ALTER TABLE "_SuppliersCompanies" DROP CONSTRAINT "_SuppliersCompanies_B_fkey";

-- AlterTable
ALTER TABLE "CompanyApplications" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Supplier" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "UserCompany" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "_SuppliersCompanies";

-- CreateTable
CREATE TABLE "_CompanyToSuppliers" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_CompanyToSuppliers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CompanyToSuppliers_B_index" ON "_CompanyToSuppliers"("B");

-- AddForeignKey
ALTER TABLE "_CompanyToSuppliers" ADD CONSTRAINT "_CompanyToSuppliers_A_fkey" FOREIGN KEY ("A") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyToSuppliers" ADD CONSTRAINT "_CompanyToSuppliers_B_fkey" FOREIGN KEY ("B") REFERENCES "Supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;
