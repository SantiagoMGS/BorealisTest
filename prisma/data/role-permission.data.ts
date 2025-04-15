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
        // Nivel máximo de permisos (DELETE incluye CREATE, READ, UPDATE)
        { subresourceName: 'Recepción', actionName: 'DELETE' },
        { subresourceName: 'Gestión', actionName: 'DELETE' },
        { subresourceName: 'Niton', actionName: 'DELETE' },
        { subresourceName: 'Absorción atómica', actionName: 'DELETE' },
        { subresourceName: 'Copelación', actionName: 'DELETE' },
      ],
    },
    {
      roleName: 'TECNICO',
      permissions: [
        // Nivel máximo de permisos (DELETE incluye CREATE, READ, UPDATE)
        { subresourceName: 'Recepción', actionName: 'DELETE' },
        { subresourceName: 'Niton', actionName: 'DELETE' },
        { subresourceName: 'Absorción atómica', actionName: 'DELETE' },
        { subresourceName: 'Copelación', actionName: 'DELETE' },
      ],
    },
    {
      roleName: 'AUXILIAR',
      permissions: [
        // Acceso de solo lectura
        { subresourceName: 'Recepción', actionName: 'READ' },
        { subresourceName: 'Niton', actionName: 'READ' },
        { subresourceName: 'Absorción atómica', actionName: 'READ' },
        { subresourceName: 'Copelación', actionName: 'READ' },
      ],
    },
    {
      roleName: 'PROVEEDOR',
      permissions: [
        // Acceso de solo lectura
        { subresourceName: 'Recepción', actionName: 'READ' },
        { subresourceName: 'Niton', actionName: 'READ' },
        { subresourceName: 'Absorción atómica', actionName: 'READ' },
        { subresourceName: 'Copelación', actionName: 'READ' },
      ],
    },
  ]; 