import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Logger } from '@nestjs/common';
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

    if (!user || !user.userId) {
       this.logger.log("❌ No hay usuario autenticado en la solicitud.");
      throw new ForbiddenException('No tienes permisos para realizar esta acción');
    }

    // 🔹 Mapear métodos HTTP a acciones
    const actionMap: Record<string, string> = {
      GET: 'read',
      POST: 'create',
      PUT: 'update',
      DELETE: 'delete'
    };

    const actionName = actionMap[method]; // 🔹 Determina la acción según el método HTTP
    if (!actionName) {
       this.logger.log(`⚠️ Método HTTP ${method} no tiene una acción asignada.`);
      return false;
    }

    // 🔹 Determinar el recurso a partir de la ruta
    const resourceName = PermissionGuard.extractResourceName(routePath);
     this.logger.log(`🔹 Acción detectada: ${actionName}, Recurso detectado: ${resourceName}`);

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
        resource: true,
        action: true,
      },
    });


    // 🔹 Validar si el usuario tiene el permiso necesario con el nivel adecuado
    const hasPermission = rolePermissions.some(rolePermission => {
      return (
        rolePermission.resource.name === resourceName &&
        rolePermission.action.level >= PermissionGuard.getActionLevel(actionName) // ✅ Permite nivel superior
      );
    });

    if (!hasPermission) {
       this.logger.log(`❌ Permiso denegado para ${actionName} en ${resourceName}`);
      throw new ForbiddenException('No tienes permisos suficientes');
    }

     this.logger.log(`✅ Permiso concedido para ${actionName} en ${resourceName}`);
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
