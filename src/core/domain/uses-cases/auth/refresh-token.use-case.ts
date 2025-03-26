import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUserRepository } from '../../repositories/user.repository';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { User } from '../../entities/user.entity';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('IUserRepository') 
    private readonly userRepository: IUserRepository,
    private readonly configService: ConfigService,
  ) {}

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  // Generar tokens
  async generateTokens(user: Omit<User, 'password'>) {
    // Payload para access token
    const accessTokenPayload = {
      sub: user.id,
      email: user.email
    };

    // Generar access token
    const accessToken = this.jwtService.sign(accessTokenPayload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '15m'
    });

    // Generar refresh token
    const refreshTokenPayload = {
      sub: user.id
    };

    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d'
    });

    const hashedRefreshToken = this.hashToken(refreshToken);
    const refreshTokenExpired = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.userRepository.updateRefreshToken(
      user.id,
      hashedRefreshToken,
      refreshTokenExpired    );

    return {
      accessToken,
      refreshToken,
      refreshTokenExpiresAt: refreshTokenExpired.toISOString(),

    };
  }

  // Refrescar token de acceso
  async refreshAccessToken(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET')
      });

      const hashedToken = this.hashToken(refreshToken);
      const user = await this.userRepository.findUserByRefreshToken(hashedToken);

      if (!user) {
        throw new UnauthorizedException('Token inválido');
      }

      // Verificar si el token ha expirado
      if (user.refreshTokenExpired && user.refreshTokenExpired < new Date()) {
        await this.userRepository.clearRefreshToken(user.id);
        throw new UnauthorizedException('Refresh token expirado');
      }

      return this.generateTokens(user);
    } catch (error) {
      // Manejar diferentes tipos de errores
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('No se pudo refrescar el token');
    }
  }

  // Cerrar sesión
  async logout(userId: string) {
    await this.userRepository.clearRefreshToken(userId);
  }
}