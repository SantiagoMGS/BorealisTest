import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@core/prisma/prisma.service';
import { AUTH_MESSAGE } from '@shared/constants/auth-message';
import * as bcrypt from 'bcrypt';
import { IAuthLoginEntity } from '@domain/entities/auth-login.entity';

@Injectable()
export class AuthLoginDataSourceService {
  private readonly logger = new Logger(AuthLoginDataSourceService.name);

  constructor(private readonly prisma: PrismaService) {}

  async login(loginData: IAuthLoginEntity): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: loginData.email },
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

      // Omitir la contraseña en la respuesta
      const { hashedPassword, ...userWithoutPassword } = user;

      return userWithoutPassword;
    } catch (error: any) {
      this.logger.error(`Error en login: ${error.message}`, error.stack);
      throw error;
    }
  }
}
