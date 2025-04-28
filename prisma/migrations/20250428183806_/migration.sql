/*
  Warnings:

  - Added the required column `statusId` to the `samples` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "samples" ADD COLUMN     "statusId" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "dore_statusId_idx" ON "dore"("statusId");

-- CreateIndex
CREATE INDEX "samples_statusId_idx" ON "samples"("statusId");

-- AddForeignKey
ALTER TABLE "samples" ADD CONSTRAINT "samples_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dore" ADD CONSTRAINT "dore_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
