import { Prisma } from '@prisma/client';

export interface SubresourceWithResourceName
  extends Prisma.SubresourceCreateManyInput {
  resourceName: string;
  controller: string;
}

export const subresourceInitialData: SubresourceWithResourceName[] = [
  // Subrecursos para LIMS
  {
    name: 'Recepción Doré',
    resourceId: '',
    resourceName: 'Recepción',
    icon: 'flask-sample',
    path: '/recepcion-dore',
    controller: 'RecepcionDoreController',
  },
  {
    name: 'Recepción Muestras',
    resourceId: '',
    resourceName: 'Recepción',
    icon: 'flask-sample',
    path: '/recepcion-muestras',
    controller: 'RecepcionMuestrasController',
  },
  {
    name: 'Gestión',
    resourceId: '',
    resourceName: 'Gestión',
    icon: 'clipboard-list',
    path: '/permisos',
    controller: 'PermisosController',
  },
  {
    name: 'Niton',
    resourceId: '',
    resourceName: 'Resultados',
    icon: 'device-niton',
    path: '/niton-results',
    controller: 'NitonResultsController',
  },
  {
    name: 'Absorción atómica',
    resourceId: '',
    resourceName: 'Resultados',
    icon: 'atom',
    path: '/absorbance-results',
    controller: 'AbsorbanceResultsController',
  },
  {
    name: 'Copelación',
    resourceId: '',
    resourceName: 'Resultados',
    icon: 'fire-hot',
    path: '/copelation',
    controller: 'CopelationController',
  },
  {
    name: 'Niton',
    resourceId: '',
    resourceName: 'Análisis',
    icon: 'shield-check',
    path: '/niton-analysis',
    controller: 'NitonAnalysisController',
  },
  {
    name: 'Absorción atómica',
    resourceId: '',
    resourceName: 'Análisis',
    icon: 'shield-check',
    path: '/absorbance-analysis',
    controller: 'AbsorbanceAnalysisController',
  },

  // Subrecursos para ADMINISTRACIÓN
  {
    name: 'Usuarios',
    resourceId: '',
    resourceName: 'Usuarios',
    icon: 'user',
    path: '/user',
    controller: 'UsersController',
  },
  {
    name: 'Compañías',
    resourceId: '',
    resourceName: 'Compañías',
    icon: 'building',
    path: '/companies',
    controller: 'CompaniesController',
  },
  {
    name: 'Aplicaciones',
    resourceId: '',
    resourceName: 'Aplicaciones',
    icon: 'application',
    path: '/applications',
    controller: 'ApplicationsController',
  },
  {
    name: 'Proveedores',
    resourceId: '',
    resourceName: 'Proveedores',
    icon: 'truck',
    path: '/providers',
    controller: 'ProvidersController',
  },
];
