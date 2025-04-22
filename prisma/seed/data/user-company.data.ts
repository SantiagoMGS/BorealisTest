import { Prisma } from '@prisma/client';

/**
 * Datos iniciales para relaciones entre usuarios y compañías
 *
 * Esta estructura será completada con IDs en el seed
 * - El usuario admin (email: admin@borealis.com) tendrá rol ADMIN en todas las compañías
 * - El usuario técnico tendrá rol AUXILIAR LABORATORIO en QUINTANA
 * - El usuario auxiliar tendrá rol AUXILIAR LABORATORIO en MONA MINAS
 * - El usuario jefe laboratorio tendrá rol JEFE LABORATORIO en COLOMBIAN MINT
 */
export const userCompanyInitialData: Array<{
  userEmail: string;
  companyName: string;
  roleName: string;
}> = [
  // Admin en todas las compañías con rol ADMIN
  {
    userEmail: 'admin@borealis.com',
    companyName: 'QUINTANA',
    roleName: 'ADMIN',
  },
  {
    userEmail: 'admin@borealis.com',
    companyName: 'MONA MINAS',
    roleName: 'ADMIN',
  },
  {
    userEmail: 'admin@borealis.com',
    companyName: 'COLOMBIAN MINT',
    roleName: 'ADMIN',
  },

  // Técnico en QUINTANA con rol AUXILIAR LABORATORIO
  {
    userEmail: 'tecnico@borealis.com',
    companyName: 'QUINTANA',
    roleName: 'AUXILIAR LABORATORIO',
  },

  // Auxiliar en MONA MINAS con rol AUXILIAR LABORATORIO
  {
    userEmail: 'auxiliar@borealis.com',
    companyName: 'MONA MINAS',
    roleName: 'AUXILIAR LABORATORIO',
  },

  // Jefe de laboratorio en COLOMBIAN MINT con rol JEFE LABORATORIO
  {
    userEmail: 'jefelaboratorio@borealis.com',
    companyName: 'COLOMBIAN MINT',
    roleName: 'JEFE LABORATORIO',
  },
];
