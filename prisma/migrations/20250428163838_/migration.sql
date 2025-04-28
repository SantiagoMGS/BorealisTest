/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `samples` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `samples` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "samples" ADD COLUMN     "code" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "samples_code_key" ON "samples"("code");
