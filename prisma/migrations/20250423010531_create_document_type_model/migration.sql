/*
  Warnings:

  - You are about to drop the column `documentType` on the `suppliers` table. All the data in the column will be lost.
  - Added the required column `documentTypeID` to the `suppliers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "suppliers" DROP COLUMN "documentType",
ADD COLUMN     "documentTypeID" UUID NOT NULL;

-- DropEnum
DROP TYPE "DocumentType";

-- CreateTable
CREATE TABLE "document_types" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "document_types_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "document_types_name_key" ON "document_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "document_types_code_key" ON "document_types"("code");

-- CreateIndex
CREATE INDEX "document_types_code_idx" ON "document_types"("code");

-- AddForeignKey
ALTER TABLE "suppliers" ADD CONSTRAINT "suppliers_documentTypeID_fkey" FOREIGN KEY ("documentTypeID") REFERENCES "document_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;
