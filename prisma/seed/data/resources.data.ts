import { Prisma } from '@prisma/client';

// Definimos los recursos utilizando directamente el tipo de Prisma
export const resourceInitialData: Prisma.ResourceCreateInput[] = [
  // Recursos para LIMS
  {
    name: 'Recepción',
    icon: 'fa-computer-speaker',
    path: '/reception',
    application: {
      connect: {
        name: 'LIMS',
      },
    },
  },
  {
    name: 'Gestión',
    icon: 'building',
    path: '/management',
    application: {
      connect: {
        name: 'LIMS',
      },
    },
  },
  {
    name: 'Resultados',
    icon: 'shield-check',
    path: '/results',
    application: {
      connect: {
        name: 'LIMS',
      },
    },
  },
  {
    name: 'Análisis',
    icon: 'shield-check',
    path: '/analysis',
    application: {
      connect: {
        name: 'LIMS',
      },
    },
  },
  // Recursos para ADMINISTRACIÓN
  {
    name: 'Usuarios',
    icon: 'user',
    path: '/users',
    application: {
      connect: {
        name: 'ADMINISTRACIÓN',
      },
    },
  },
  {
    name: 'Compañías',
    icon: 'building',
    path: '/companies',
    application: {
      connect: {
        name: 'ADMINISTRACIÓN',
      },
    },
  },
  {
    name: 'Aplicaciones',
    icon: 'application',
    path: '/applications',
    application: {
      connect: {
        name: 'ADMINISTRACIÓN',
      },
    },
  },
  {
    name: 'Proveedores',
    icon: 'truck',
    path: '/providers',
    application: {
      connect: {
        name: 'ADMINISTRACIÓN',
      },
    },
  },
  {
    name: 'Orígenes de Recepción',
    icon: 'fa-truck',
    path: '/reception-origins',
    application: {
      connect: {
        name: 'ADMINISTRACIÓN',
      },
    },
  },
  {
    name: 'Impresoras',
    icon: 'fa-printer',
    path: '/printers',
    application: {
      connect: {
        name: 'ADMINISTRACIÓN',
      },
    },
  },
];
