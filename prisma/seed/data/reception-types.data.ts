import { Prisma } from '@prisma/client';

export const receptionTypeInitialData: Prisma.ReceptionTypeCreateInput[] = [
  {
    name: 'Dore',
    description: 'Recepción de Dore',
    isActive: true,
  },
  {
    name: 'Muestras',
    description: 'Recepción de Muestras',
    isActive: true,
  },
  {
    name: 'Mineral',
    description: 'Mineral en bruto para procesamiento',
    isActive: true,
  },
  {
    name: 'Concentrado',
    description: 'Material con alta concentración de minerales valiosos',
    isActive: true,
  },
];
