import { Prisma } from '@prisma/client';

export const receptionOriginInitialData: Prisma.ReceptionOriginCreateInput[] = [
  {
    name: 'Aluvial',
    description: 'Origen Aluvial',
    isActive: true,
  },
  {
    name: 'Subsistencia',
    description: 'Origen de Subsistencia',
    isActive: true,
  },
  {
    name: 'Joyería',
    description: 'Origen de Joyería',
    isActive: true,
  },
  {
    name: 'Cola',
    description: 'Origen Cola',
    isActive: true,
  },
  {
    name: 'Cabeza',
    description: 'Origen Cabeza',
    isActive: true,
  },
  {
    name: 'Secado',
    description: 'Origen Secado',
    isActive: true,
  },
];
