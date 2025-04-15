import { Prisma } from '@prisma/client';

export interface ResourceWithApplicationName extends Prisma.ResourceCreateInput {
  applicationName: string;
}

export const resourceInitialData: ResourceWithApplicationName[] = [
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
  }
]; 