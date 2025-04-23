import { Prisma } from '@prisma/client';

export const receptionTypeInitialData: Prisma.ReceptionTypeCreateInput[] = [
  {
    name: 'Doré',
    description:
      'Aleación de oro y plata con pequeñas cantidades de metales base',
    isActive: true,
  },
  {
    name: 'Muestras',
    description: 'Muestras de mineral para análisis',
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
