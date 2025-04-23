/*
  Warnings:

  - You are about to drop the column `receptionOrigin` on the `receptions` table. All the data in the column will be lost.
  - You are about to drop the column `receptionType` on the `receptions` table. All the data in the column will be lost.
  - Added the required column `receptionOriginId` to the `receptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receptionTypeId` to the `receptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "receptions" DROP COLUMN "receptionOrigin",
DROP COLUMN "receptionType",
ADD COLUMN     "receptionOriginId" UUID NOT NULL,
ADD COLUMN     "receptionTypeId" UUID NOT NULL;

-- DropEnum
DROP TYPE "ReceptionOrigin";

-- DropEnum
DROP TYPE "ReceptionType";

-- CreateTable
CREATE TABLE "reception_types" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "reception_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reception_origins" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "reception_origins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reception_types_name_key" ON "reception_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "reception_origins_name_key" ON "reception_origins"("name");

-- CreateIndex
CREATE INDEX "receptions_receptionTypeId_idx" ON "receptions"("receptionTypeId");

-- CreateIndex
CREATE INDEX "receptions_receptionOriginId_idx" ON "receptions"("receptionOriginId");

-- AddForeignKey
ALTER TABLE "receptions" ADD CONSTRAINT "receptions_receptionTypeId_fkey" FOREIGN KEY ("receptionTypeId") REFERENCES "reception_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receptions" ADD CONSTRAINT "receptions_receptionOriginId_fkey" FOREIGN KEY ("receptionOriginId") REFERENCES "reception_origins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
