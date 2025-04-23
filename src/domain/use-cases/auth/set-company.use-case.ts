import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ITokenPort, TokenPayload } from '@domain/ports/auth/token.port';
import { SessionRepository } from '@domain/repositories/auth';
import { Request } from 'express';
import { PrismaService } from '@core/prisma/prisma.service';

@Injectable()
export class SetCompanyUseCase {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly tokenPort: ITokenPort,
    private readonly prisma: PrismaService,
  ) {}

  async execute(
    companyId: string,
    req: Request,
  ): Promise<{ access_token: string; refresh_token: string }> {
    // Obtener el userId del usuario autenticado
    const user = req.user as { id: string };
    if (!user || !user.id) {
      throw new UnauthorizedException(
        'Usuario no autenticado o token inválido',
      );
    }

    const userId = user.id;

    // Verificar que el usuario existe en la base de datos
    const userRecord = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userRecord) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar que la compañía existe y que el usuario tiene acceso a ella
    const userCompany = await this.prisma.userCompany.findFirst({
      where: {
        userId,
        companyId,
      },
      include: {
        company: true,
        role: true,
      },
    });

    if (!userCompany) {
      throw new NotFoundException('Compañía no encontrada o sin acceso');
    }

    // Generar nuevo payload para el token con la información solicitada
    const payload: TokenPayload = {
      sub: userId,
      companyId: companyId,
      roleId: userCompany.roleId,
    };

    // Generar nuevos tokens
    const tokens = this.tokenPort.generateTokens(payload);

    // Actualizar la sesión del usuario
    await this.updateUserSession(userId, tokens, req);

    return tokens;
  }

  private async updateUserSession(
    userId: string,
    tokens: { access_token: string; refresh_token: string },
    req: Request,
  ): Promise<void> {
    // Eliminar todas las sesiones activas del usuario
    await this.sessionRepository.deleteUserSessions(userId);

    const deviceInfo = req?.headers['user-agent'];
    const ipAddress = req?.ip;

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    const refreshExpiresAt = new Date();
    refreshExpiresAt.setDate(refreshExpiresAt.getDate() + 7);

    const sessionData = {
      userId,
      token: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt,
      refreshExpiresAt,
      device: deviceInfo,
      ipAddress,
      lastActive: new Date(),
    };

    // Crear una nueva sesión con el nuevo token
    await this.sessionRepository.createSession(sessionData);
  }
}
