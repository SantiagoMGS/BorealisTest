import { Prisma } from '@prisma/client';

export const supplierInitialData: Prisma.SupplierCreateInput[] = [
  {
    name: 'Minería Los Andes S.A.S',
    documentType: {
      connect: {
        code: 'NIT',
      },
    },
    documentNumber: '900123456-7',
  },
  {
    name: 'Carlos Pérez - Minero Independiente',
    documentType: {
      connect: {
        code: 'CC',
      },
    },
    documentNumber: '79856234',
  },
  {
    name: 'Cooperativa Minera del Pacífico',
    documentType: {
      connect: {
        code: 'NIT',
      },
    },
    documentNumber: '812345678-9',
  },
  {
    name: 'Extracción Minerales del Cauca',
    documentType: {
      connect: {
        code: 'NIT',
      },
    },
    documentNumber: '860234567-1',
  },
  {
    name: 'Sofia Rodriguez - Joyería',
    documentType: {
      connect: {
        code: 'CE',
      },
    },
    documentNumber: '52436789',
  },
];
