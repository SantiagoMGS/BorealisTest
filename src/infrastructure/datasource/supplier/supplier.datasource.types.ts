import { Prisma } from '@prisma/client';

export type SupplierWithDocumentType = Prisma.SupplierGetPayload<{
  include: { documentType: true };
}>;

export type SupplierSelected = Prisma.SupplierGetPayload<{
  select: {
    id: true;
    name: true;
    documentNumber: true;
    shortName: true;
    createdAt: true;
    updatedAt: true;
    isActive: true;
    documentType: {
      select: {
        id: true;
        name: true;
        code: true;
      };
    };
  };
}>;
