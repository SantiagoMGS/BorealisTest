import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { envs } from '@core/config';
import {
  ITokenPort,
  TokenPayload,
  TokenResponse,
} from '@domain/ports/auth/token.port';

@Injectable()
export class TokenService implements ITokenPort {
  constructor(private readonly jwtService: JwtService) {}

  generateTokens(payload: TokenPayload): TokenResponse {
    // Firmar el access token
    const accessToken = this.jwtService.sign(payload);

    // Firmar el refresh token con diferente expiración
    const refreshToken = this.jwtService.sign(payload, {
      secret: envs.jwtRefreshSecret,
      expiresIn: envs.jwtRefreshExpiration,
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  verifyToken(token: string): TokenPayload {
    return this.jwtService.verify(token);
  }
}
