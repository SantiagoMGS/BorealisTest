import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions_controller';

/**
 * Decorador para establecer el controlador requerido para el permiso
 * Si se aplica a nivel de controlador, se usará como valor predeterminado para todos los métodos
 * Si se aplica a nivel de método, anulará el controlador del nivel de clase
 *
 * @param controller Nombre del controlador al que se aplicará el permiso
 * @returns Decorador configurado
 *
 * @example
 * // A nivel de controlador (aplicará a todos los métodos)
 * @RequirePermission(SupplierController.name)
 * export class SupplierController {}
 *
 * @example
 * // A nivel de método (anulará el valor del controlador)
 * @RequirePermission('CustomControllerName')
 * @Get()
 * findAll() {}
 */
export const RequirePermission = (controller: string) =>
  SetMetadata(PERMISSIONS_KEY, controller);
