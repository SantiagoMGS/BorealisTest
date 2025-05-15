import { Prisma } from '@prisma/client';

export type SupplierMiningTitleWithRelations =
  Prisma.SupplierMiningTitleGetPayload<{
    include: {
      mineType: true;
      city: {
        include: {
          department: true;
        };
      };
    };
  }>;
