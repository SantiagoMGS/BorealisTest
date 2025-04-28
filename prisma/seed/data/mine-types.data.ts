import { Prisma } from '@prisma/client';

export const mineTypeInitialData: Prisma.mineTypeCreateInput[] = [
  {
    name: 'Aluvial',
    royaltyPercentage: '6.0000',
    isActive: true,
  },
  {
    name: 'Socavón',
    royaltyPercentage: '4.0000',
    isActive: true,
  },
];
