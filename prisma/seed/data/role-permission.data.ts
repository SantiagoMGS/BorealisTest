// Esta estructura será completada en el seed ya que requiere IDs existentes
export const rolePermissionInitialData: {
  roleName: string;
  permissions: Array<{
    subresourceName: string;
    resourceName: string;
    actionName: string;
  }>;
}[] = [
  {
    roleName: 'ADMIN',
    permissions: [
      // Nivel máximo de permisos (DELETE incluye CREATE, READ, UPDATE) para todas las subrecursos
    ],
  },
  {
    roleName: 'JEFE LABORATORIO',
    permissions: [
      {
        subresourceName: 'Recepción Muestras',
        resourceName: 'Recepción',
        actionName: 'UPDATE',
      },
      {
        subresourceName: 'Gestión',
        resourceName: 'Gestión',
        actionName: 'UPDATE',
      },
      {
        subresourceName: 'Niton',
        resourceName: 'Resultados',
        actionName: 'UPDATE',
      },
      {
        subresourceName: 'Absorción atómica',
        resourceName: 'Resultados',
        actionName: 'UPDATE',
      },
      {
        subresourceName: 'Copelación',
        resourceName: 'Resultados',
        actionName: 'UPDATE',
      },
      {
        subresourceName: 'Absorción atómica',
        resourceName: 'Análisis',
        actionName: 'UPDATE',
      },
      {
        subresourceName: 'Niton',
        resourceName: 'Análisis',
        actionName: 'UPDATE',
      },
      {
        subresourceName: 'Compañías',
        resourceName: 'Compañías',
        actionName: 'UPDATE',
      },
      {
        subresourceName: 'Aplicaciones',
        resourceName: 'Aplicaciones',
        actionName: 'UPDATE',
      },
      {
        subresourceName: 'Proveedores',
        resourceName: 'Proveedores',
        actionName: 'UPDATE',
      },
      {
        subresourceName: 'Usuarios',
        resourceName: 'Usuarios',
        actionName: 'UPDATE',
      },
    ],
  },
  {
    roleName: 'AUXILIAR LABORATORIO',
    permissions: [
      // Acceso de solo create a Recepción y Análisis
      {
        subresourceName: 'Recepción Muestras',
        resourceName: 'Recepción',
        actionName: 'CREATE',
      },
      {
        subresourceName: 'Absorción atómica',
        resourceName: 'Análisis',
        actionName: 'CREATE',
      },
      {
        subresourceName: 'Niton',
        resourceName: 'Análisis',
        actionName: 'CREATE',
      },
    ],
  },
];
