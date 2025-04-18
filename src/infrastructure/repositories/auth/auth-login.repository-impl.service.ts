import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginRepository } from '@domain/repositories/auth/login.repository';
import { LoginDataSourceService } from '@infrastructure/datasource/auth/auth-login.dataosurce.service';
import { envs } from '@core/config';
import { ILoginEntity } from '@domain/entities/auth/login.entity';
import { ILoginResponse } from '@domain/interfaces/auth/login-response.interface';
@Injectable()
export class LoginRepositoryImplService implements LoginRepository {
  constructor(
    private readonly loginDataSourceService: LoginDataSourceService,

    private readonly jwtService: JwtService,
  ) {}

  async login(loginData: ILoginEntity): Promise<ILoginResponse> {
    // Obtener los datos del usuario autenticado
    const user = await this.loginDataSourceService.login(loginData);

    // Generar payload para el JWT
    const payload = {
      sub: user.id,
      // Aquí se puede agregar más información al token
    };

    // Firmar el access token
    const accessToken = this.jwtService.sign(payload);

    // Firmar el refresh token con diferente expiración
    const refreshToken = this.jwtService.sign(payload, {
      secret: envs.jwtRefreshSecret,
      expiresIn: envs.jwtRefreshExpiration,
    });

    // Retornar usuario con tokens
    return {
      ...user,
      tokens: {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    };
  }
}
