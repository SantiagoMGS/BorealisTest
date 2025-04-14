import { Prisma } from '@prisma/client';

export const subresourceInitialData: Prisma.SubresourceCreateManyInput[] = [
  // Subrecursos para Usuarios
  {
    name: 'Gestión de usuarios',
    resourceId: '', // Se completará en el seed
    icon: 'user',
  },
  {
    name: 'Permisos',
    resourceId: '', // Se completará en el seed
    icon: 'key',
  },
  
  // Subrecursos para Compañías
  {
    name: 'Gestión de compañías',
    resourceId: '', // Se completará en el seed
    icon: 'building-office',
  },
  {
    name: 'Branding',
    resourceId: '', // Se completará en el seed
    icon: 'paint-brush',
  },
  
  // Subrecursos para Roles
  {
    name: 'Gestión de roles',
    resourceId: '', // Se completará en el seed
    icon: 'shield',
  },
  {
    name: 'Asignación de roles',
    resourceId: '', // Se completará en el seed
    icon: 'user-plus',
  },
  
  // Subrecursos para Proveedores
  {
    name: 'Gestión de proveedores',
    resourceId: '', // Se completará en el seed
    icon: 'truck-container',
  },
  
  // Subrecursos para Lotes
  {
    name: 'Gestión de lotes',
    resourceId: '', // Se completará en el seed
    icon: 'cube-transparent',
  },
  
  // Subrecursos para Muestras
  {
    name: 'Gestión de muestras',
    resourceId: '', // Se completará en el seed
    icon: 'flask',
  },
  {
    name: 'Resultados',
    resourceId: '', // Se completará en el seed
    icon: 'clipboard-document-check',
  },
  
  // Subrecursos para Aplicaciones
  {
    name: 'Gestión de aplicaciones',
    resourceId: '', // Se completará en el seed
    icon: 'cog',
  },
  {
    name: 'Asignación de aplicaciones',
    resourceId: '', // Se completará en el seed
    icon: 'puzzle-piece',
  },
  
  // Subrecursos para Dashboard
  {
    name: 'Indicadores',
    resourceId: '', // Se completará en el seed
    icon: 'chart-bar',
  },
  {
    name: 'Reportes',
    resourceId: '', // Se completará en el seed
    icon: 'document-report',
  },
]; 