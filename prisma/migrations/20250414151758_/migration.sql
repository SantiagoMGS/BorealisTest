-- CreateTable
CREATE TABLE "application_resources" (
    "applicationId" UUID NOT NULL,
    "resourceId" UUID NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" UUID,
    "updatedBy" UUID,

    CONSTRAINT "application_resources_pkey" PRIMARY KEY ("applicationId","resourceId")
);

-- CreateIndex
CREATE INDEX "application_resources_applicationId_idx" ON "application_resources"("applicationId");

-- CreateIndex
CREATE INDEX "application_resources_resourceId_idx" ON "application_resources"("resourceId");

-- AddForeignKey
ALTER TABLE "application_resources" ADD CONSTRAINT "application_resources_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_resources" ADD CONSTRAINT "application_resources_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;
