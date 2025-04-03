import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { User } from '../../entities/user.entity';
import { ISessionRepository } from '../../repositories/session.repository';
import { IUserRepository } from '../../repositories/user.repository';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('ISessionRepository')
    private readonly sessionRepository: ISessionRepository,

    private readonly configService: ConfigService,
  ) { }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  async generateTokens(user: Omit<User, 'password'>) {
    const accessTokenPayload = { sub: user.id, email: user.email };
    const refreshTokenPayload = { sub: user.id };


    const accessToken = this.jwtService.sign(accessTokenPayload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRATION')
    });


    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION')
    });

    return {
      userId: user.id,
      accessToken,
      refreshToken,
      refreshTokenExpiresAt: new Date(Date.now() +
        (this.configService.get<number>('JWT_REFRESH_EXPIRATION') ?? 0) * 1000).toISOString()
    };
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET')
      });

      const hashedToken = this.hashToken(refreshToken);

      const session = await this.sessionRepository.findSessionByRefreshToken(hashedToken);

      if (!session || !session.userId) {
        throw new UnauthorizedException('Token inválido');
      }

      if (session.refreshExpiresAt && session.refreshExpiresAt < new Date()) {
        await this.sessionRepository.deleteSession(session.token); // O por ID si prefieres
        throw new UnauthorizedException('Refresh token expirado');
      }

      const tokens = await this.generateTokens(session.user);

      await this.sessionRepository.updateSession(session.id!, {
        token: this.hashToken(tokens.accessToken),
        refreshToken: this.hashToken(tokens.refreshToken),
        expiresAt: new Date(Date.now() + (this.configService.get<number>('JWT_EXPIRATION') ?? 0) * 1000),
        refreshExpiresAt: new Date(Date.now() + (this.configService.get<number>('JWT_REFRESH_EXPIRATION') ?? 0) * 1000),
        lastActive: new Date(),


      });

      return tokens;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('No se pudo refrescar el token');
    }
  }

  async logout(userId: string) {
    await this.userRepository.clearRefreshToken(userId);
  }
}
