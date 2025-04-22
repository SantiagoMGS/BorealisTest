import { ILoginEntity } from '@domain/entities/auth';
import { ILoginResponse } from '@domain/interfaces/auth';
import { Injectable } from '@nestjs/common';
import { LoginRepository } from '@domain/repositories/auth';
import { Request } from 'express';
import { SessionRepository } from '@domain/repositories/auth';
import { ISessionEntity } from '@domain/entities/auth';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly loginRepository: LoginRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  async execute(
    loginData: ILoginEntity,
    req?: Request,
  ): Promise<ILoginResponse> {
    // Obtener usuario con tokens ya generados por el repositorio
    const user = await this.loginRepository.login(loginData);

    const deviceInfo = req?.headers['user-agent'];
    const ipAddress = req?.ip;

    // Registrar la sesión con los tokens generados por el repositorio
    if (user.tokens) {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);

      const refreshExpiresAt = new Date();
      refreshExpiresAt.setDate(refreshExpiresAt.getDate() + 7);

      // Invalidar sesiones anteriores
      await this.sessionRepository.invalidateUserSessions(user.id);

      const sessionData: ISessionEntity = {
        userId: user.id,
        token: user.tokens.access_token,
        refreshToken: user.tokens.refresh_token,
        expiresAt,
        refreshExpiresAt,
        device: deviceInfo,
        ipAddress,
        lastActive: new Date(),
      };

      await this.sessionRepository.createSession(sessionData);
    }

    return user;
  }
}
