import { Prisma } from '@prisma/client';

export const receptionOriginInitialData: Prisma.ReceptionOriginCreateInput[] = [
  {
    name: 'Cabeza',
    description: 'Material de entrada al proceso metalúrgico',
    isActive: true,
  },
  {
    name: 'Cola',
    description: 'Material de salida del proceso metalúrgico',
    isActive: true,
  },
  {
    name: 'Secado',
    description: 'Material después del proceso de secado',
    isActive: true,
  },
  {
    name: 'Aluvial',
    description: 'Material de origen aluvial',
    isActive: true,
  },
  {
    name: 'Joyería',
    description: 'Material proveniente de joyería',
    isActive: true,
  },
  {
    name: 'Subsistencia',
    description: 'Material de minería artesanal y de subsistencia',
    isActive: true,
  },
];
