import { ISessionEntity } from '@domain/entities/auth';
import { SessionRepository } from '@domain/repositories/auth';
import { Injectable } from '@nestjs/common';
import { ITokenPort, TokenPayload } from '@domain/ports/auth/token.port';

@Injectable()
export class SessionManagementUseCase {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly tokenPort: ITokenPort,
  ) {}

  // Este método ya no se usará en el flujo de login
  // pero lo mantenemos para compatibilidad con otras partes del código
  async createSession(
    userId: string,
    device?: string,
    ipAddress?: string,
  ): Promise<{ token: string; refreshToken: string }> {
    // Eliminar todas las sesiones anteriores del usuario
    await this.sessionRepository.deleteUserSessions(userId);

    const payload: TokenPayload = { sub: userId };
    const tokens = this.tokenPort.generateTokens(payload);

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    const refreshExpiresAt = new Date();
    refreshExpiresAt.setDate(refreshExpiresAt.getDate() + 7);

    const sessionData: ISessionEntity = {
      userId,
      token: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt,
      refreshExpiresAt,
      device,
      ipAddress,
      lastActive: new Date(),
    };

    await this.sessionRepository.createSession(sessionData);

    return {
      token: tokens.access_token,
      refreshToken: tokens.refresh_token,
    };
  }

  async validateSession(token: string): Promise<boolean> {
    try {
      const payload = this.tokenPort.verifyToken(token);

      const isValid = await this.sessionRepository.validateSession(token);

      if (isValid) {
        await this.sessionRepository.updateLastActive(token);
      }

      return isValid;
    } catch (error) {
      return false;
    }
  }

  async invalidateSession(token: string): Promise<void> {
    return this.sessionRepository.invalidateSession(token);
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<{ token: string; refreshToken: string } | null> {
    try {
      const payload = this.tokenPort.verifyToken(refreshToken);
      const userId = payload.sub;

      const session =
        await this.sessionRepository.getActiveSessionByUserId(userId);

      if (!session || session.refreshToken !== refreshToken) {
        return null;
      }

      return this.createSession(userId, session.device, session.ipAddress);
    } catch (error) {
      return null;
    }
  }
}
