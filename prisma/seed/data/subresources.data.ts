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
    icon: 'fa-coins',
    path: 'lims/recepcion-dore',
    controller: 'DoreReceptionController',
  },
  {
    name: 'Recepción Muestras',
    resource: {
      connect: {
        name: 'Recepción',
      },
    },
    icon: 'fa-vial-virus',
    path: 'lims/recepcion-muestras',
    controller: 'SampleReceptionController',
  },
  {
    name: 'Gestionar Recepción Doré',
    resource: {
      connect: {
        name: 'Gestión',
      },
    },
    icon: 'clipboard-list',
    path: 'lims/list-dore-receptions',
    controller: 'DoreManagementController',
  },
  {
    name: 'Listar Recepción Muestras',
    resource: {
      connect: {
        name: 'Gestión',
      },
    },
    icon: 'clipboard-list',
    path: 'lims/list-sample-receptions',
    controller: 'ListSampleReceptionController',
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
    icon: 'fa-user',
    path: '/administration/users',
    controller: 'UsersController',
  },
  {
    name: 'Compañías',
    resource: {
      connect: {
        name: 'Compañías',
      },
    },
    icon: 'fa-building',
    path: '/administration/companies',
    controller: 'CompanyController',
  },
  {
    name: 'Aplicaciones',
    resource: {
      connect: {
        name: 'Aplicaciones',
      },
    },
    icon: 'fa-cogs',
    path: 'administration/applications',
    controller: 'ApplicationsController',
  },
  {
    name: 'Proveedores',
    resource: {
      connect: {
        name: 'Proveedores',
      },
    },
    icon: 'fa-user-tie',
    path: '/administration/suppliers',
    controller: 'SupplierController',
  },
  //{
  //  name: 'Orígenes de Recepción',
  //  resource: {
  //    connect: {
  //      name: 'Orígenes de Recepción',
  //    },
  //  },
  //  icon: 'fa-truck',
  //  path: '/administration/reception-origins',
  //  controller: 'ReceptionOriginController',
  //},
  {
    name: 'Impresoras de Etiquetas',
    resource: {
      connect: {
        name: 'Impresoras',
      },
    },
    icon: 'fa-printer',
    path: '/administration/label-printers',
    controller: 'LabelPrinterController',
  },
];
