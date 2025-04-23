/*
  Warnings:

  - You are about to drop the column `documentTypeID` on the `suppliers` table. All the data in the column will be lost.
  - Added the required column `documentTypeId` to the `suppliers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "suppliers" DROP CONSTRAINT "suppliers_documentTypeID_fkey";

-- AlterTable
ALTER TABLE "suppliers" DROP COLUMN "documentTypeID",
ADD COLUMN     "documentTypeId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "suppliers" ADD CONSTRAINT "suppliers_documentTypeId_fkey" FOREIGN KEY ("documentTypeId") REFERENCES "document_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;
