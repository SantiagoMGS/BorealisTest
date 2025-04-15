import { Prisma } from '@prisma/client';

export interface ResourceWithApplicationName extends Prisma.ResourceCreateInput {
  applicationName: string;
}

export const resourceInitialData: ResourceWithApplicationName[] = [
  // Recursos para LIMS
  {
    name: 'Recepción',
    icon: 'user-group',
    path: '/reception',
    applicationName: 'LIMS',
  },
  {
    name: 'Gestión',
    icon: 'building',
    path: '/management',
    applicationName: 'LIMS',
  },
  {
    name: 'Resultados',
    icon: 'shield-check',
    path: '/results',
    applicationName: 'LIMS',
  },
  // Recursos para ADMINISTRACIÓN
  {
    name: 'Usuarios',
    icon: 'user',
    path: '/users',
    applicationName: 'ADMINISTRACIÓN',
  },
  {
    name: 'Roles',
    icon: 'shield-check',
    path: '/roles',
    applicationName: 'ADMINISTRACIÓN',
  },
  {
    name: 'Proveedores',
    icon: 'truck',
    path: '/providers',
    applicationName: 'ADMINISTRACIÓN',
  },
]; 