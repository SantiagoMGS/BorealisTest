import { Prisma } from '@prisma/client';

export const subresourceInitialData: Prisma.SubresourceCreateManyInput[] = [
  // Subrecursos para Usuarios
  {
    name: 'Gestión de usuarios',
    resourceId: '', // Se completará en el seed
    icon: 'user',
    path: '/gestion-usuarios',
  },
  {
    name: 'Permisos',
    resourceId: '', // Se completará en el seed
    icon: 'key',
    path: '/permisos',
  },
  
  // Subrecursos para Compañías
  {
    name: 'Gestión de compañías',
    resourceId: '', // Se completará en el seed
    icon: 'building-office',
    path: '/gestion-companias',
  },
  {
    name: 'Branding',
    resourceId: '', // Se completará en el seed
    icon: 'paint-brush',
    path: '/branding',
  },
  
  // Subrecursos para Roles
  {
    name: 'Gestión de roles',
    resourceId: '', // Se completará en el seed
    icon: 'shield',
    path: '/gestion-roles',
  },
  {
    name: 'Asignación de roles',
    resourceId: '', // Se completará en el seed
    icon: 'user-plus',
    path: '/asignacion-roles',
  },
  
  // Subrecursos para Proveedores
  {
    name: 'Gestión de proveedores',
    resourceId: '', // Se completará en el seed
    icon: 'truck-container',
    path: '/gestion-proveedores',
  },
  
  // Subrecursos para Lotes
  {
    name: 'Gestión de lotes',
    resourceId: '', // Se completará en el seed
    icon: 'cube-transparent',
    path: '/gestion-lotes',
  },
  
  // Subrecursos para Muestras
  {
    name: 'Gestión de muestras',
    resourceId: '', // Se completará en el seed
    icon: 'flask',
    path: '/gestion-muestras',
  },
  {
    name: 'Resultados',
    resourceId: '', // Se completará en el seed
    icon: 'clipboard-document-check',
    path: '/resultados',
  },
  
  // Subrecursos para Aplicaciones
  {
    name: 'Gestión de aplicaciones',
    resourceId: '', // Se completará en el seed
    icon: 'cog',
    path: '/gestion-aplicaciones',
  },
  {
    name: 'Asignación de aplicaciones',
    resourceId: '', // Se completará en el seed
    icon: 'puzzle-piece',
    path: '/asignacion-aplicaciones',
  },
  
  // Subrecursos para Dashboard
  {
    name: 'Indicadores',
    resourceId: '', // Se completará en el seed
    icon: 'chart-bar',
    path: '/indicadores',
  },
  {
    name: 'Reportes',
    resourceId: '', // Se completará en el seed
    icon: 'document-report',
    path: '/reportes',
  },
]; 