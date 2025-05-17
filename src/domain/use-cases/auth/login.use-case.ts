import { ILoginEntity, ISessionEntity } from '@domain/entities/auth';
import { ILogin } from '@domain/interfaces/auth';
import { Injectable } from '@nestjs/common';
import { LoginRepository, SessionRepository } from '@domain/repositories/auth';
import { Request } from 'express';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly loginRepository: LoginRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  async execute(loginData: ILoginEntity, req?: Request): Promise<ILogin> {
    // Obtener usuario con tokens ya generados por el repositorio
    const user = await this.loginRepository.login(loginData);

    const deviceInfo = req?.headers['user-agent'];
    const ipAddress = req?.ip;

    if (user.tokens) {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);

      const refreshExpiresAt = new Date();
      refreshExpiresAt.setDate(refreshExpiresAt.getDate() + 7);

      await this.sessionRepository.deleteUserSessions(user.id);

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
