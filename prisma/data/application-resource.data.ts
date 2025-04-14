
// Esta estructura será completada en el seed ya que requiere IDs existentes
export const applicationResourceInitialData: Array<{
  applicationName: string;
  resourceNames: string[];
}> = [
  {
    applicationName: 'LIMS',
    resourceNames: ['Usuarios', 'Muestras', 'Lotes', 'Proveedores', 'Dashboard'],
  },
  {
    applicationName: 'PLANTA',
    resourceNames: ['Usuarios', 'Lotes', 'Proveedores', 'Dashboard'],
  },
  {
    applicationName: 'CI',
    resourceNames: ['Usuarios', 'Proveedores', 'Dashboard'],
  },
  {
    applicationName: 'MINA',
    resourceNames: ['Usuarios', 'Lotes', 'Dashboard'],
  },
  {
    applicationName: 'BOREALIS APP',
    resourceNames: ['Usuarios', 'Compañías', 'Roles', 'Aplicaciones', 'Dashboard'],
  },
  {
    applicationName: 'GESTIÓN HUMANA',
    resourceNames: ['Usuarios', 'Dashboard'],
  },
]; 