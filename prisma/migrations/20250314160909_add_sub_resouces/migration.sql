-- DropForeignKey
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_resourceId_fkey";

-- CreateTable
CREATE TABLE "Subresource" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "resourceId" UUID NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subresource_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Subresource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subresource" ADD CONSTRAINT "Subresource_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;
