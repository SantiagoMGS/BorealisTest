/*
  Warnings:

  - You are about to drop the column `isDeleted` on the `actions` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `batch_types` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `batches` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `preparation_types` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `preparations` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `resources` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `resources` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `results` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `roles` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `samples` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `subresources` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `subresources` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `subsample_types` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `subsamples` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `subzones` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `suppliers` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `tests` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `zones` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[icon]` on the table `resources` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[icon]` on the table `subresources` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `icon` to the `resources` table without a default value. This is not possible if the table is not empty.
  - Added the required column `icon` to the `subresources` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "applications_code_key";

-- DropIndex
DROP INDEX "companies_code_key";

-- AlterTable
ALTER TABLE "actions" DROP COLUMN "isDeleted";

-- AlterTable
ALTER TABLE "applications" DROP COLUMN "code",
DROP COLUMN "isDeleted";

-- AlterTable
ALTER TABLE "batch_types" DROP COLUMN "isDeleted";

-- AlterTable
ALTER TABLE "batches" DROP COLUMN "isDeleted";

-- AlterTable
ALTER TABLE "companies" DROP COLUMN "code",
DROP COLUMN "isDeleted";

-- AlterTable
ALTER TABLE "preparation_types" DROP COLUMN "isDeleted";

-- AlterTable
ALTER TABLE "preparations" DROP COLUMN "isDeleted";

-- AlterTable
ALTER TABLE "resources" DROP COLUMN "description",
DROP COLUMN "isDeleted",
ADD COLUMN     "icon" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "results" DROP COLUMN "isDeleted";

-- AlterTable
ALTER TABLE "roles" DROP COLUMN "isDeleted";

-- AlterTable
ALTER TABLE "samples" DROP COLUMN "isDeleted";

-- AlterTable
ALTER TABLE "subresources" DROP COLUMN "description",
DROP COLUMN "isDeleted",
ADD COLUMN     "icon" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "subsample_types" DROP COLUMN "isDeleted";

-- AlterTable
ALTER TABLE "subsamples" DROP COLUMN "isDeleted";

-- AlterTable
ALTER TABLE "subzones" DROP COLUMN "isDeleted";

-- AlterTable
ALTER TABLE "suppliers" DROP COLUMN "isDeleted";

-- AlterTable
ALTER TABLE "tests" DROP COLUMN "isDeleted";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "isDeleted";

-- AlterTable
ALTER TABLE "zones" DROP COLUMN "isDeleted";

-- CreateIndex
CREATE UNIQUE INDEX "resources_icon_key" ON "resources"("icon");

-- CreateIndex
CREATE UNIQUE INDEX "subresources_icon_key" ON "subresources"("icon");
