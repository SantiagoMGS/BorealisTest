/*
  Warnings:

  - You are about to drop the column `analysisResult` on the `analyses` table. All the data in the column will be lost.
  - You are about to drop the column `resultValue` on the `analysis_types` table. All the data in the column will be lost.
  - Added the required column `resultValue` to the `analyses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `analysisResult` to the `analysis_types` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "analyses" DROP COLUMN "analysisResult",
ADD COLUMN     "resultValue" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "analysis_types" DROP COLUMN "resultValue",
ADD COLUMN     "analysisResult" JSONB NOT NULL;
