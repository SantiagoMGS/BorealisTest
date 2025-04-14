import { Prisma } from '@prisma/client';

export const roleInitialData: Prisma.RoleCreateInput[] = [
  {
    name: 'SUPERADMIN',
    description: 'Rol con acceso completo a todas las funcionalidades',
    isSystem: true,
  },
  {
    name: 'ADMIN',
    description: 'Administrador con acceso a gestión de usuarios y configuraciones',
    isSystem: true,
  },
  {
    name: 'TECNICO',
    description: 'Técnico de laboratorio con acceso a gestión de muestras y resultados',
    isSystem: false,
  },
  {
    name: 'AUXILIAR',
    description: 'Auxiliar con acceso limitado a consulta de información',
    isSystem: false,
  },
  {
    name: 'PROVEEDOR',
    description: 'Proveedor externo con acceso a consulta de sus lotes y resultados',
    isSystem: false,
  },
]; 