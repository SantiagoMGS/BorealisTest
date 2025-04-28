-- CreateTable
CREATE TABLE "dore" (
    "id" UUID NOT NULL,
    "code" INTEGER NOT NULL,
    "receivedWeight" DECIMAL(10,4) NOT NULL DEFAULT 0,
    "finalWeight" DECIMAL(10,4) NOT NULL DEFAULT 0,
    "goldLaw" DECIMAL(10,4) NOT NULL DEFAULT 0,
    "goldWeight" DECIMAL(10,4) NOT NULL DEFAULT 0,
    "silverLaw" DECIMAL(10,4) NOT NULL DEFAULT 0,
    "silverWeight" DECIMAL(10,4) NOT NULL DEFAULT 0,
    "goldBalance" DECIMAL(10,4) NOT NULL DEFAULT 0,
    "silverBalance" DECIMAL(10,4) NOT NULL DEFAULT 0,
    "approvedLaw" BOOLEAN NOT NULL DEFAULT false,
    "observation" TEXT,
    "statusId" UUID NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" UUID,
    "updatedBy" UUID,

    CONSTRAINT "dore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "countries" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departments" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "daneCode" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "countryId" UUID NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cities" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "daneCode" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "departmentId" UUID NOT NULL,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dore_code_key" ON "dore"("code");

-- CreateIndex
CREATE INDEX "dore_code_idx" ON "dore"("code");

-- CreateIndex
CREATE UNIQUE INDEX "countries_name_key" ON "countries"("name");

-- CreateIndex
CREATE INDEX "countries_name_idx" ON "countries"("name");

-- CreateIndex
CREATE UNIQUE INDEX "departments_name_key" ON "departments"("name");

-- CreateIndex
CREATE UNIQUE INDEX "departments_daneCode_key" ON "departments"("daneCode");

-- CreateIndex
CREATE INDEX "departments_name_idx" ON "departments"("name");

-- CreateIndex
CREATE INDEX "cities_name_idx" ON "cities"("name");

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cities" ADD CONSTRAINT "cities_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
