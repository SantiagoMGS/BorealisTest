import { Prisma } from '@prisma/client';

export const measurementUnitInitialData: Prisma.MeasurementUnitCreateInput[] = [
  {
    name: 'Miligramos',
    shortName: 'mg',
  },
  {
    name: 'Gramos',
    shortName: 'gr',
  },
  {
    name: 'Kilogramos',
    shortName: 'kg',
  },
  {
    name: 'Toneladas',
    shortName: 'ton',
  },
  {
    name: 'Mililitros',
    shortName: 'ml',
  },
  {
    name: 'Litros',
    shortName: 'l',
  },
];
