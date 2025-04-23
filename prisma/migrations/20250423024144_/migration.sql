/*
  Warnings:

  - You are about to drop the `application_resources` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `applicationId` to the `resources` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "application_resources" DROP CONSTRAINT "application_resources_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "application_resources" DROP CONSTRAINT "application_resources_resourceId_fkey";

-- AlterTable
ALTER TABLE "resources" ADD COLUMN     "applicationId" UUID NOT NULL;

-- DropTable
DROP TABLE "application_resources";

-- CreateIndex
CREATE INDEX "resources_applicationId_idx" ON "resources"("applicationId");

-- AddForeignKey
ALTER TABLE "resources" ADD CONSTRAINT "resources_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
