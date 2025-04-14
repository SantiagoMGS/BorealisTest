
// Esta estructura será completada en el seed ya que requiere IDs existentes
export const rolePermissionInitialData: {
  roleName: string;
  permissions: Array<{
    subresourceName: string;
    actionName: string;
  }>;
}[] = [
  {
    roleName: 'SUPERADMIN',
    permissions: [
      // Darle todos los permisos sobre todos los subrecursos
      // Se generará dinámicamente en el seed
    ],
  },
  {
    roleName: 'ADMIN',
    permissions: [
      // Gestión de usuarios
      { subresourceName: 'Gestión de usuarios', actionName: 'READ' },
      { subresourceName: 'Gestión de usuarios', actionName: 'CREATE' },
      { subresourceName: 'Gestión de usuarios', actionName: 'UPDATE' },
      
      // Permisos
      { subresourceName: 'Permisos', actionName: 'READ' },
      { subresourceName: 'Permisos', actionName: 'UPDATE' },
      
      // Gestión de compañías
      { subresourceName: 'Gestión de compañías', actionName: 'READ' },
      { subresourceName: 'Gestión de compañías', actionName: 'UPDATE' },
      
      // Branding
      { subresourceName: 'Branding', actionName: 'READ' },
      { subresourceName: 'Branding', actionName: 'UPDATE' },
      
      // Gestión de aplicaciones
      { subresourceName: 'Gestión de aplicaciones', actionName: 'READ' },
      
      // Dashboard
      { subresourceName: 'Indicadores', actionName: 'READ' },
      { subresourceName: 'Reportes', actionName: 'READ' },
    ],
  },
  {
    roleName: 'TECNICO',
    permissions: [
      // Gestión de muestras
      { subresourceName: 'Gestión de muestras', actionName: 'READ' },
      { subresourceName: 'Gestión de muestras', actionName: 'CREATE' },
      { subresourceName: 'Gestión de muestras', actionName: 'UPDATE' },
      
      // Resultados
      { subresourceName: 'Resultados', actionName: 'READ' },
      { subresourceName: 'Resultados', actionName: 'CREATE' },
      { subresourceName: 'Resultados', actionName: 'UPDATE' },
      
      // Gestión de lotes
      { subresourceName: 'Gestión de lotes', actionName: 'READ' },
      
      // Dashboard
      { subresourceName: 'Indicadores', actionName: 'READ' },
    ],
  },
  {
    roleName: 'AUXILIAR',
    permissions: [
      // Gestión de muestras (solo lectura)
      { subresourceName: 'Gestión de muestras', actionName: 'READ' },
      
      // Resultados (solo lectura)
      { subresourceName: 'Resultados', actionName: 'READ' },
      
      // Gestión de lotes (solo lectura)
      { subresourceName: 'Gestión de lotes', actionName: 'READ' },
    ],
  },
  {
    roleName: 'PROVEEDOR',
    permissions: [
      // Solo acceso a sus propios lotes
      { subresourceName: 'Gestión de lotes', actionName: 'READ' },
      { subresourceName: 'Resultados', actionName: 'READ' },
    ],
  },
]; 