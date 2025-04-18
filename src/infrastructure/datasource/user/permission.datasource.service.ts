import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@core/prisma/prisma.service';

@Injectable()
export class PermissionDataSourceService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Obtiene la relación entre un usuario y una compañía.
   *
   * @param userId ID del usuario
   * @param companyId ID de la compañía
   * @throws NotFoundException si el usuario no pertenece a la compañía
   */
  async getUserCompany(userId: string, companyId: string) {
    const userCompany = await this.prisma.userCompany.findUnique({
      where: {
        userId_companyId: {
          userId,
          companyId,
        },
      },
      include: {
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    console.log('userCompany');
    console.log(userCompany);

    if (!userCompany) {
      throw new NotFoundException('El usuario no pertenece a esta compañía');
    }

    return userCompany;
  }

  /**
   * Obtiene la información de una compañía incluyendo su branding.
   *
   * @param companyId ID de la compañía
   * @throws NotFoundException si no se encuentra la compañía
   * @returns Datos de la compañía con su branding
   */
  async getCompanyWithBranding(companyId: string) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      include: {
        branding: true,
      },
    });

    if (!company) {
      throw new NotFoundException(
        'No se encontró una compañía con el ID proporcionado',
      );
    }

    return company;
  }

  /**
   * Método optimizado que utiliza la función almacenada en PostgreSQL para obtener
   * todos los permisos de un usuario para una compañía específica en una sola consulta.
   *
   * @param userId ID del usuario
   * @param companyId ID de la compañía
   * @returns Arreglo con los permisos estructurados por la función almacenada
   */
  async getUserPermissionsByCompany(userId: string, companyId: string) {
    return this.prisma.$queryRaw`
      SELECT * FROM get_user_permissions_by_company(${userId}::uuid, ${companyId}::uuid)
    `;
  }
}
