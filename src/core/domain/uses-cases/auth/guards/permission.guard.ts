import { CanActivate, ExecutionContext, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  private readonly logger = new Logger(PermissionGuard.name);

  constructor(private readonly reflector: Reflector, private readonly prisma: PrismaService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.logger.log("✅ PermissionGuard ejecutándose...");

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const routePath = request.route.path;  // 🔹 Obtiene la ruta actual
    const method = request.method;         // 🔹 Obtiene el método HTTP

    this.logger.log(`🔹 Validando permisos para ${method} en ${routePath}`);
    if (!user || !user.id) {
      this.logger.log("❌ No hay usuario autenticado en la solicitud.");
      throw new ForbiddenException('No tienes permisos para realizar esta acción');
    }

    // 🔹 Mapear métodos HTTP a acciones
    const actionMap: Record<string, string> = {
      GET: 'read',
      POST: 'create',
      PATCH: 'update',
      DELETE: 'delete'
    };

    const actionName = actionMap[method]; // 🔹 Determina la acción según el método HTTP
    if (!actionName) {
      this.logger.log(`⚠️ Método HTTP ${method} no tiene una acción asignada.`);
      return false;
    }

    const subresourceName = PermissionGuard.extractSubresourceName(routePath);
    this.logger.log(`🔹 Subrecurso detectado: ${subresourceName}`);

    // 🔹 Obtener el rol del usuario en la empresa
    const userCompany = await this.prisma.userCompany.findFirst({
      where: { userId: user.id },
      select: { roleId: true }
    });

    if (!userCompany) {

      throw new ForbiddenException('El usuario no tiene un rol asignado en ninguna empresa.');
    }

    // 🔹 Buscar permisos del rol con el recurso y la acción correspondientes
    const rolePermissions = await this.prisma.rolePermission.findMany({
      where: { roleId: userCompany.roleId },
      include: {
        subresource: true,
        action: true,
      },
    });


    // 🔹 Validar si el usuario tiene el permiso necesario con el nivel adecuado
    const hasPermission = rolePermissions.some(rolePermission => {
      const subresourceMatch = rolePermission.subresource.name.toLowerCase() === subresourceName.toLowerCase();
      const actionLevelMatch = rolePermission.action.level >= PermissionGuard.getActionLevel(actionName);

      this.logger.log(`🔹 Comparando subrecurso: ${rolePermission.subresource.name.toLowerCase()} con ${subresourceName.toLowerCase()}`);
      this.logger.log(`🔹 Nivel de acción en BD: ${rolePermission.action.level}, Nivel requerido: ${PermissionGuard.getActionLevel(actionName)}`);
      this.logger.log(`🔹 Subrecurso coincide: ${subresourceMatch}, Nivel suficiente: ${actionLevelMatch}`);

      return subresourceMatch && actionLevelMatch;
    });

    if (!hasPermission) {
      this.logger.log(`❌ Permiso denegado para ${actionName} en ${subresourceName}`);
      throw new ForbiddenException('No tienes permisos suficientes');
    }

    this.logger.log(`✅ Permiso concedido para ${actionName} en ${subresourceName}`);
    return true;
  }

  /**
   * 🔹 Extrae el nombre del recurso desde la ruta.
   * Por ejemplo: '/user/:id' -> 'user'
   */
  private static extractResourceName(routePath: string): string {
    const parts = routePath.split('/').filter(part => part !== 'api' && part !== ''); // Filtra 'api' y vacíos
    return parts.length > 0 ? parts[0] : 'unknown'; // Retorna el primer segmento después de '/api/'
  }

  private static extractSubresourceName(routePath: string): string {
    const parts = routePath.split('/').filter(part => part !== 'api' && part !== '');

    // Si el recurso principal es 'user', busca el subrecurso
    if (parts[0] === 'user' && parts.length > 1) {
      return parts[0]; // Retorna el segundo segmento como subrecurso
    }

    // Si no hay subrecurso, retorna 'user' como recurso principal o 'unknown'
    return parts[0] || 'unknown';
  }

  /**
   * 🔹 Obtiene el nivel jerárquico de una acción.
   * Los niveles permiten controlar permisos escalables (ej. 'delete' > 'create').
   */
  private static getActionLevel(action: string): number {
    const actionLevels: Record<string, number> = {
      read: 1,
      create: 2,
      update: 3,
      delete: 4, // 🔥 NIVEL MÁS ALTO
    };
    return actionLevels[action] || 0;
  }
}
