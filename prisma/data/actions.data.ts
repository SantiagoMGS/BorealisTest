import { Prisma } from '@prisma/client';

export const actionInitialData: Prisma.ActionCreateInput[] = [
  {
    name: 'READ',
    level: 1,
    description: 'Permite leer datos sin modificarlos',
  },
  {
    name: 'CREATE',
    level: 2,
    description: 'Permite crear nuevos registros',
  },
  {
    name: 'UPDATE',
    level: 3,
    description: 'Permite modificar registros existentes',
  },
  {
    name: 'DELETE',
    level: 4,
    description: 'Permite eliminar registros',
  },
];
