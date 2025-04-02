-- CreateTable
CREATE TABLE "Subsample" (
    "id" UUID NOT NULL,
    "sampleId" UUID NOT NULL,
    "subsampleTypeId" UUID NOT NULL,
    "peso" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "subZoneId" UUID NOT NULL,

    CONSTRAINT "Subsample_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubsampleType" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubsampleType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Zone" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "subZoneId" UUID NOT NULL,

    CONSTRAINT "Zone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubZone" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubZone_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SubsampleType_name_key" ON "SubsampleType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Zone_name_key" ON "Zone"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SubZone_name_key" ON "SubZone"("name");

-- AddForeignKey
ALTER TABLE "Subsample" ADD CONSTRAINT "Subsample_subZoneId_fkey" FOREIGN KEY ("subZoneId") REFERENCES "SubZone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subsample" ADD CONSTRAINT "Subsample_sampleId_fkey" FOREIGN KEY ("sampleId") REFERENCES "Sample"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subsample" ADD CONSTRAINT "Subsample_subsampleTypeId_fkey" FOREIGN KEY ("subsampleTypeId") REFERENCES "SubsampleType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Zone" ADD CONSTRAINT "Zone_subZoneId_fkey" FOREIGN KEY ("subZoneId") REFERENCES "SubZone"("id") ON DELETE CASCADE ON UPDATE CASCADE;
