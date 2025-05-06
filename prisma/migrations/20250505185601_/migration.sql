/*
  Warnings:

  - Added the required column `base64` to the `dore` table without a default value. This is not possible if the table is not empty.
  - Added the required column `format` to the `dore` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "dore" ADD COLUMN     "base64" TEXT NOT NULL,
ADD COLUMN     "format" TEXT NOT NULL;
