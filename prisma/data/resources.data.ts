import { Prisma } from '@prisma/client';

export const resourceInitialData: Prisma.ResourceCreateInput[] = [
  {
    name: 'Usuarios',
    icon: 'user-group',
    path: '/usuarios',
  },
  {
    name: 'Compañías',
    icon: 'building',
    path: '/companias',
  },
  {
    name: 'Roles',
    icon: 'shield-check',
    path: '/roles',
  },
  {
    name: 'Proveedores',
    icon: 'truck',
    path: '/proveedores',
  },
  {
    name: 'Lotes',
    icon: 'cube',
    path: '/lotes',
  },
  {
    name: 'Muestras',
    icon: 'beaker',
    path: '/muestras',
  },
  {
    name: 'Aplicaciones',
    icon: 'app-store',
    path: '/aplicaciones',
  },
  {
    name: 'Dashboard',
    icon: 'chart-pie',
    path: '/dashboard',
  },
]; 