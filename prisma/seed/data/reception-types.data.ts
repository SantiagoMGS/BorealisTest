import { Prisma } from '@prisma/client';

export const receptionTypeInitialData: Prisma.ReceptionTypeCreateInput[] = [
  {
    name: 'Doré',
    description: 'Recepción de Dore',
  },
  {
    name: 'Muestra',
    description: 'Recepción de Muestras',
  },
  {
    name: 'Mineral',
    description: 'Mineral en bruto para procesamiento',
  },
  {
    name: 'Concentrado',
    description: 'Material con alta concentración de minerales valiosos',
  },
];
