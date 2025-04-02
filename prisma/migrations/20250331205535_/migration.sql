/*
  Warnings:

  - You are about to drop the column `name` on the `preparation` table. All the data in the column will be lost.
  - You are about to drop the column `schema` on the `preparation` table. All the data in the column will be lost.
  - Added the required column `value` to the `preparation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `schema` to the `preparationType` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "preparationType_name_key";

-- AlterTable
ALTER TABLE "preparation" DROP COLUMN "name",
DROP COLUMN "schema",
ADD COLUMN     "value" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "preparationType" ADD COLUMN     "schema" TEXT NOT NULL;
