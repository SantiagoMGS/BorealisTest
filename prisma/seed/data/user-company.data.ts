import { Prisma } from '@prisma/client';

/**
 * Datos iniciales para relaciones entre usuarios y compañías
 *
 * Esta estructura será completada con IDs en el seed
 * - El usuario superadmin (email: superadmin@borealis.com) tendrá rol SUPER_ADMIN sin compañía específica
 * - Cada compañía tendrá su propio administrador con rol ADMIN y permisos DELETE
 * - Los usuarios técnicos y auxiliares mantienen sus roles en sus respectivas compañías
 */
export const userCompanyInitialData: Array<{
  userEmail: string;
  companyName: string;
  roleName: string;
}> = [
  {
    userEmail: 'superadmin@borealis.com',
    companyName: 'QUINTANA',
    roleName: 'SUPER_ADMIN',
  },
  {
    userEmail: 'superadmin@borealis.com',
    companyName: 'MONA MINAS',
    roleName: 'SUPER_ADMIN',
  },
  {
    userEmail: 'superadmin@borealis.com',
    companyName: 'COLOMBIAN MINT',
    roleName: 'SUPER_ADMIN',
  },

  {
    userEmail: 'admin@quintana.com',
    companyName: 'QUINTANA',
    roleName: 'ADMIN',
  },

  {
    userEmail: 'admin@monaminas.com',
    companyName: 'MONA MINAS',
    roleName: 'ADMIN',
  },

  {
    userEmail: 'admin@colombianmint.com',
    companyName: 'COLOMBIAN MINT',
    roleName: 'ADMIN',
  },

  {
    userEmail: 'auxiliar@quintana.com',
    companyName: 'QUINTANA',
    roleName: 'AUXILIAR LABORATORIO',
  },

  {
    userEmail: 'jefelaboratorio@quintana.com',
    companyName: 'QUINTANA',
    roleName: 'JEFE LABORATORIO',
  },
];
