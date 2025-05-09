/*
  Warnings:

  - You are about to drop the column `resultValue` on the `analyses` table. All the data in the column will be lost.
  - Added the required column `resultValue` to the `analysis_types` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "analyses" DROP COLUMN "resultValue";

-- AlterTable
ALTER TABLE "analysis_types" ADD COLUMN     "resultValue" JSONB NOT NULL;
