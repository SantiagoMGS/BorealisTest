import { DocumentType, Prisma } from '@prisma/client';

export const supplierInitialData: Prisma.SupplierCreateInput[] = [
  {
    name: 'Minería Los Andes S.A.S',
    documentType: DocumentType.NIT,
    documentNumber: '900123456-7',
  },
  {
    name: 'Carlos Pérez - Minero Independiente',
    documentType: DocumentType.CC,
    documentNumber: '79856234',
  },
  {
    name: 'Cooperativa Minera del Pacífico',
    documentType: DocumentType.NIT,
    documentNumber: '812345678-9',
  },
  {
    name: 'Extracción Minerales del Cauca',
    documentType: DocumentType.NIT,
    documentNumber: '860234567-1',
  },
  {
    name: 'Sofia Rodriguez - Joyería',
    documentType: DocumentType.CE,
    documentNumber: '52436789',
  },
];
