import { Prisma } from '@prisma/client';

export const subresourceInitialData: Prisma.SubresourceCreateInput[] = [
  // Subrecursos para LIMS
  {
    name: 'Recepción Doré',
    resource: {
      connect: {
        name: 'Recepción',
      },
    },
    icon: 'flask-sample',
    path: '/recepcion-dore',
    controller: 'RecepcionDoreController',
  },
  {
    name: 'Recepción Muestras',
    resource: {
      connect: {
        name: 'Recepción',
      },
    },
    icon: 'flask-sample',
    path: '/recepcion-muestras',
    controller: 'SampleReceptionController',
  },
  {
    name: 'Gestión',
    resource: {
      connect: {
        name: 'Gestión',
      },
    },
    icon: 'clipboard-list',
    path: '/permisos',
    controller: 'PermisosController',
  },
  {
    name: 'Niton',
    resource: {
      connect: {
        name: 'Resultados',
      },
    },
    icon: 'device-niton',
    path: '/niton-results',
    controller: 'NitonResultsController',
  },
  {
    name: 'Absorción atómica',
    resource: {
      connect: {
        name: 'Resultados',
      },
    },
    icon: 'atom',
    path: '/absorbance-results',
    controller: 'AbsorbanceResultsController',
  },
  {
    name: 'Copelación',
    resource: {
      connect: {
        name: 'Resultados',
      },
    },
    icon: 'fire-hot',
    path: '/copelation',
    controller: 'CopelationController',
  },
  {
    name: 'Niton',
    resource: {
      connect: {
        name: 'Análisis',
      },
    },
    icon: 'shield-check',
    path: '/niton-analysis',
    controller: 'NitonAnalysisController',
  },
  {
    name: 'Absorción atómica',
    resource: {
      connect: {
        name: 'Análisis',
      },
    },
    icon: 'shield-check',
    path: '/absorbance-analysis',
    controller: 'AbsorbanceAnalysisController',
  },

  // Subrecursos para ADMINISTRACIÓN
  {
    name: 'Usuarios',
    resource: {
      connect: {
        name: 'Usuarios',
      },
    },
    icon: 'user',
    path: '/user',
    controller: 'UsersController',
  },
  {
    name: 'Compañías',
    resource: {
      connect: {
        name: 'Compañías',
      },
    },
    icon: 'building',
    path: '/companies',
    controller: 'CompaniesController',
  },
  {
    name: 'Aplicaciones',
    resource: {
      connect: {
        name: 'Aplicaciones',
      },
    },
    icon: 'application',
    path: '/applications',
    controller: 'ApplicationsController',
  },
  {
    name: 'Proveedores',
    resource: {
      connect: {
        name: 'Proveedores',
      },
    },
    icon: 'truck',
    path: '/providers',
    controller: 'SupplierController',
  },
];
