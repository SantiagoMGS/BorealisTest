/*
  Warnings:

  - The values [NIT_EXTERIOR,PASAPORTE,CEDULA_DE_CIUDADANIA,CEDULA_DE_EXTRANJERIA] on the enum `DocumentType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DocumentType_new" AS ENUM ('NIT', 'NIT_EXT', 'PAS', 'CC', 'CE');
ALTER TABLE "suppliers" ALTER COLUMN "documentType" TYPE "DocumentType_new" USING ("documentType"::text::"DocumentType_new");
ALTER TYPE "DocumentType" RENAME TO "DocumentType_old";
ALTER TYPE "DocumentType_new" RENAME TO "DocumentType";
DROP TYPE "DocumentType_old";
COMMIT;
