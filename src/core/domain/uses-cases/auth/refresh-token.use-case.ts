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

  async generateTokens(user: Omit<User, 'password'>) {
    const accessTokenPayload = {
      sub: user.id,
      email: user.email
    };

    const accessToken = this.jwtService.sign(accessTokenPayload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '15m'
    });

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
      refreshTokenExpired
    );

    return {
      userId: user.id,
      accessToken,
      refreshToken,
      refreshTokenExpiresAt: refreshTokenExpired.toISOString()
    };
  }

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

      if (user.refreshTokenExpired && user.refreshTokenExpired < new Date()) {
        await this.userRepository.clearRefreshToken(user.id);
        throw new UnauthorizedException('Refresh token expirado');
      }

      return this.generateTokens(user);
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
