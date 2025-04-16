import { Prisma } from '@prisma/client';

export interface SubresourceWithResourceName
  extends Prisma.SubresourceCreateManyInput {
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
    path: '/niton-results',
  },
  {
    name: 'Absorción atómica',
    resourceId: '',
    resourceName: 'Resultados',
    icon: 'atom',
    path: '/absorbance-results',
  },
  {
    name: 'Copelación',
    resourceId: '',
    resourceName: 'Resultados',
    icon: 'fire-hot',
    path: '/copelation',
  },
  {
    name: 'Niton',
    resourceId: '',
    resourceName: 'Análisis',
    icon: 'shield-check',
    path: '/niton-analysis',
  },
  {
    name: 'Absorción atómica',
    resourceId: '',
    resourceName: 'Análisis',
    icon: 'shield-check',
    path: '/absorbance-analysis',
  },

  // Subrecursos para ADMINISTRACIÓN
  {
    name: 'Usuarios',
    resourceId: '',
    resourceName: 'Usuarios',
    icon: 'user',
    path: '/users',
  },
  {
    name: 'Compañías',
    resourceId: '',
    resourceName: 'Compañías',
    icon: 'building',
    path: '/companies',
  },
  {
    name: 'Aplicaciones',
    resourceId: '',
    resourceName: 'Aplicaciones',
    icon: 'application',
    path: '/applications',
  },
  {
    name: 'Proveedores',
    resourceId: '',
    resourceName: 'Proveedores',
    icon: 'truck',
    path: '/providers',
  },
];
