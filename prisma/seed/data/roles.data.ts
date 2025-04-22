import { Prisma } from '@prisma/client';

export const roleInitialData: Prisma.RoleCreateInput[] = [
  {
    name: 'ADMIN',
    description: 'Administrador con acceso completo al sistema',
  },
  {
    name: 'JEFE LABORATORIO',
    description:
      'Responsable de supervisar todas las operaciones del laboratorio',
  },
  {
    name: 'AUXILIAR LABORATORIO',
    description: 'Personal de apoyo en las operaciones básicas del laboratorio',
  },
];
