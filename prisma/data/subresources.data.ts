import { Prisma } from '@prisma/client';

export interface SubresourceWithResourceName extends Prisma.SubresourceCreateManyInput {
  resourceName: string;
}

export const subresourceInitialData: SubresourceWithResourceName[] = [
  // Subrecursos para LIMS
  {
    name: 'Recepción',
    resourceId: '',
    resourceName: 'Recepción',
    icon: 'flask-sample',
    path: '/gestion-muestras',
  },
  {
    name: 'Gestión',
    resourceId: '',
    resourceName: 'Gestión',
    icon: 'clipboard-list',
    path: '/permisos',
  },
  {
    name: 'Niton',
    resourceId: '',
    resourceName: 'Resultados',
    icon: 'device-niton',
    path: '/niton',
  },
  {
    name: 'Absorción atómica',
    resourceId: '',
    resourceName: 'Resultados',
    icon: 'atom',
    path: '/absorbance',
  },
  {
    name: 'Copelación',
    resourceId: '',
    resourceName: 'Resultados',
    icon: 'fire-hot',
    path: '/copelation',
  },
]; 