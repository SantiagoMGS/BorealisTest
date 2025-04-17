import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@core/prisma/prisma.service';
import { AUTH_MESSAGE } from '@shared/constants/auth-message';
import * as bcrypt from 'bcrypt';
import { ILoginEntity } from '@domain/entities/login.entity';

@Injectable()
export class LoginDataSourceService {
  private readonly logger = new Logger(LoginDataSourceService.name);

  constructor(private readonly prisma: PrismaService) {}

  async login(loginData: ILoginEntity): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: loginData.email },
        include: {
          companies: {
            where: {
              isActive: true,
            },
            include: {
              company: {
                include: {
                  branding: true,
                },
              },
            },
          },
        },
      });

      if (!user) {
        throw new UnauthorizedException(AUTH_MESSAGE.CREDENTIALS_INCORRECT);
      }

      // Comparar contraseña con bcrypt
      const isPasswordValid = await bcrypt.compare(
        loginData.password,
        user.hashedPassword,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException(AUTH_MESSAGE.CREDENTIALS_INCORRECT);
      }

      if (!user.isActive) {
        throw new UnauthorizedException(AUTH_MESSAGE.USER_NOT_ACTIVE);
      }

      // Formatear respuesta
      const {
        hashedPassword,
        isActive,
        createdAt,
        updatedAt,
        name,
        email,
        ...userData
      } = user;

      // Formatear las compañías
      const formattedCompanies = user.companies.map((uc) => {
        const { company, ...ucData } = uc;
        const { branding } = company;

        // Extraer solo los datos de branding necesarios
        const formattedBranding = branding
          ? {
              logo: branding.logo,
              primaryColor: branding.primaryColor,
              secondaryColor: branding.secondaryColor,
              tertiaryColor: branding.tertiaryColor,
            }
          : null;

        return {
          id: company.id,
          name: company.name,
          shortName: company.shortName,
          role: ucData.roleId,
          branding: formattedBranding,
        };
      });

      return {
        ...userData,
        companies: formattedCompanies,
      };
    } catch (error: any) {
      this.logger.error(`Error en login: ${error.message}`, error.stack);
      throw error;
    }
  }
}
