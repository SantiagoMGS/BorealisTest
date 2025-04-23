import { Prisma } from '@prisma/client';

export const documentTypeInitialData: Prisma.DocumentTypeCreateInput[] = [
  {
    name: 'Cédula de Ciudadanía',
    code: 'CC',
  },
  {
    name: 'Tarjeta de Identidad',
    code: 'TI',
  },
  {
    name: 'Cédula de Extranjería',
    code: 'CE',
  },
  {
    name: 'Número de Identificación Tributaria',
    code: 'NIT',
  },
];
