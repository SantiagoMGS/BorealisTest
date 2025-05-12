import { Injectable } from '@nestjs/common';
import { LoginRepository } from '@domain/repositories/auth/login.repository';
import { LoginDataSourceService } from '@infrastructure/datasource/auth/login.datasource.service';
import { ILoginEntity } from '@domain/entities/auth/login.entity';
import { ILoginResponse } from '@domain/interfaces/auth/login-response.interface';
import { ITokenPort, TokenPayload } from '@domain/ports/auth/token.port';

@Injectable()
export class LoginRepositoryImplService implements LoginRepository {
  constructor(
    private readonly loginDataSourceService: LoginDataSourceService,
    private readonly tokenPort: ITokenPort,
  ) {}

  async login(loginData: ILoginEntity): Promise<ILoginResponse> {
    // Obtener los datos del usuario autenticado
    const user = await this.loginDataSourceService.login(loginData);

    // Generar payload para el JWT
    const payload: TokenPayload = {
      sub: user.id,
      // Aquí se puede agregar más información al token
    };

    // Generar tokens usando el servicio de token
    const tokens = this.tokenPort.generateTokens(payload);

    // Retornar usuario con tokens
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      companies: user.companies,
      tokens,
    };
  }
}
