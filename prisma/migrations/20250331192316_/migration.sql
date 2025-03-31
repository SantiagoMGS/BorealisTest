/*
  Warnings:

  - You are about to drop the `CompanyAplications` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[logo]` on the table `Application` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `logo` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CompanyAplications" DROP CONSTRAINT "CompanyAplications_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "CompanyAplications" DROP CONSTRAINT "CompanyAplications_companyId_fkey";

-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "logo" TEXT NOT NULL;

-- DropTable
DROP TABLE "CompanyAplications";

-- CreateTable
CREATE TABLE "CompanyApplications" (
    "companyId" UUID NOT NULL,
    "applicationId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyApplications_pkey" PRIMARY KEY ("companyId","applicationId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Application_logo_key" ON "Application"("logo");

-- AddForeignKey
ALTER TABLE "CompanyApplications" ADD CONSTRAINT "CompanyApplications_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyApplications" ADD CONSTRAINT "CompanyApplications_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
