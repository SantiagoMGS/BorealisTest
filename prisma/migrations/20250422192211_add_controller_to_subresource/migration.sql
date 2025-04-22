/*
  Warnings:

  - A unique constraint covering the columns `[controller]` on the table `subresources` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `controller` to the `subresources` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "subresources" ADD COLUMN     "controller" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "subresources_controller_key" ON "subresources"("controller");
