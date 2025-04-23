import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '@core/decorators/require-permission.decorator';
import { PermissionsService } from '@infrastructure/services/access/permissions.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  private readonly logger = new Logger(PermissionsGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly permissionsService: PermissionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Extraer el controlador del decorador o usar el actual si no está especificado
    const controllerName = this.getControllerName(context);

    if (!controllerName) {
      this.logger.warn(
        'No se encontró nombre de controlador para verificar permisos',
      );
      return false;
    }

    // 2. Determinar la acción basada en el método HTTP (GET→read, POST→create, etc.)
    const request = context.switchToHttp().getRequest();
    const httpMethod = request.method;

    // 3. Acceder al token JWT que contiene companyId y roleId
    const user = request.user as {
      id: string;
      companyId?: string;
      roleId?: string;
    };

    if (!user) {
      this.logger.warn('No se encontró usuario en la solicitud');
      return false;
    }

    // Si no hay companyId o roleId en el token, significa que el usuario no ha seleccionado una compañía
    if (!user.companyId || !user.roleId) {
      throw new ForbiddenException(
        'Debe seleccionar una compañía para acceder a este recurso',
      );
    }

    // 4. Verificar si el rol tiene el permiso necesario considerando el sistema escalonado
    const hasPermission = await this.permissionsService.hasPermission(
      user.roleId,
      user.companyId,
      controllerName,
      httpMethod,
    );

    if (!hasPermission) {
      this.logger.warn(
        `Acceso denegado: usuario ${user.id} con rol ${user.roleId} no tiene permiso para ${httpMethod} en ${controllerName}`,
      );
      throw new ForbiddenException(
        'No tiene permisos para realizar esta acción',
      );
    }

    return true;
  }

  /**
   * Obtiene el nombre del controlador desde los metadatos del decorador
   */
  private getControllerName(context: ExecutionContext): string | undefined {
    // Primero intentar obtener desde el método (tiene precedencia)
    const methodPermission = this.reflector.get<string>(
      PERMISSIONS_KEY,
      context.getHandler(),
    );

    if (methodPermission) {
      return methodPermission;
    }

    // Si no hay a nivel de método, obtener desde la clase
    const classPermission = this.reflector.get<string>(
      PERMISSIONS_KEY,
      context.getClass(),
    );

    if (classPermission) {
      return classPermission;
    }

    // Si no se especificó, intentar usar el nombre de la clase actual
    const className = context.getClass().name;
    if (className) {
      return className;
    }

    return undefined;
  }
}
