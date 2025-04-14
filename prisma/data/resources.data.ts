import { Prisma } from '@prisma/client';

export const resourceInitialData: Prisma.ResourceCreateInput[] = [
  {
    name: 'Usuarios',
    icon: 'user-group',
  },
  {
    name: 'Compañías',
    icon: 'building',
  },
  {
    name: 'Roles',
    icon: 'shield-check',
  },
  {
    name: 'Proveedores',
    icon: 'truck',
  },
  {
    name: 'Lotes',
    icon: 'cube',
  },
  {
    name: 'Muestras',
    icon: 'beaker',
  },
  {
    name: 'Aplicaciones',
    icon: 'app-store',
  },
  {
    name: 'Dashboard',
    icon: 'chart-pie',
  },
]; 