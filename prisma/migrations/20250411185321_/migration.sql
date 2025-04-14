/*
  Warnings:

  - A unique constraint covering the columns `[path]` on the table `applications` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[path]` on the table `resources` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[path]` on the table `subresources` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `path` to the `applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `path` to the `resources` table without a default value. This is not possible if the table is not empty.
  - Added the required column `path` to the `subresources` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "applications" ADD COLUMN     "path" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "resources" ADD COLUMN     "path" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "subresources" ADD COLUMN     "path" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "applications_path_key" ON "applications"("path");

-- CreateIndex
CREATE UNIQUE INDEX "resources_path_key" ON "resources"("path");

-- CreateIndex
CREATE UNIQUE INDEX "subresources_path_key" ON "subresources"("path");
