import { Prisma } from '@prisma/client';

export const mineTypeInitialData: Prisma.mineTypeCreateInput[] = [
  {
    name: 'Aluvial',
    royalty_percentage: '6.0000',
    isActive: true,
  },
  {
    name: 'Socavón',
    royalty_percentage: '4.0000',
    isActive: true,
  },
];
