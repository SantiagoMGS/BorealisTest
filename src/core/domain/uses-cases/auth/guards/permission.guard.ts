import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<{ resource: string; action: string }[]>(
      'permissions',
      context.getHandler(),
    );

    if (!requiredPermissions) return true; // Si no se requieren permisos, permite la acción

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.permissions) {
      throw new ForbiddenException('No tienes permisos para realizar esta acción');
    }

    console.log("🔹 Permisos del usuario en guardia:", user.permissions); // 🔥 LOG PARA DEPURAR

    // Verifica si el usuario tiene un nivel suficiente para el permiso requerido
    const hasPermission = requiredPermissions.some(requiredPermission =>
      user.permissions.some(userPermission => {
        console.log(`🔹 COMPARANDO: `, {
          requiredResource: requiredPermission.resource,
          requiredAction: requiredPermission.action,
          requiredLevel: getActionLevel(requiredPermission.action),
          userResource: userPermission.resource,
          userAction: userPermission.action,
          userLevel: userPermission.level,
        });

        return (
          userPermission.resource === requiredPermission.resource &&
          userPermission.level >= getActionLevel(requiredPermission.action)
        );
      })
    );


    if (!hasPermission) {
      throw new ForbiddenException('No tienes permisos suficientes');
    }

    return true;
  }
}

// Mapeo de acciones con niveles jerárquicos
const getActionLevel = (action: string): number => {
  const actionLevels: Record<string, number> = {
    read: 1,
    create: 2,
    update: 3,
    delete: 4,  // NIVEL MÁS ALTO
  };
  return actionLevels[action] || 0; 
};
