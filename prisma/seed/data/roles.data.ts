import { Prisma } from '@prisma/client';

export const roleInitialData: Prisma.RoleCreateInput[] = [
  {
    name: 'SUPER_ADMIN',
    description:
      'Super administrador con acceso total a todas las compañías del sistema',
  },
  {
    name: 'ADMIN',
    description: 'Administrador con acceso completo a una compañía específica',
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
