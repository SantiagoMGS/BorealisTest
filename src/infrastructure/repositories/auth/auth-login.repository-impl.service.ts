import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginRepository } from '@domain/repositories/auth/login.repository';
import { LoginDataSourceService } from '@infrastructure/datasource/auth/auth-login.dataosurce.service';
import { ILoginEntity } from '@domain/entities/auth/login.entity';
import { AuthSessionManagementUseCase } from '@domain/use-cases/auth/auth-session-management.use-case';

@Injectable()
export class LoginRepositoryImplService implements LoginRepository {
  constructor(
    private readonly loginDataSourceService: LoginDataSourceService,

    private readonly jwtService: JwtService,
  ) { }

  async login(loginData: ILoginEntity): Promise<any> {
    // Obtener los datos del usuario autenticado
    const user = await this.loginDataSourceService.login(loginData);

    // Generar payload para el JWT
    const payload = {
      sub: user.id,
      email: user.email,
      // Puedes añadir más datos como roles si es necesario
    };


    // Firmar el token
    const accessToken = this.jwtService.sign(payload);

    // Retornar usuario con token
    return {
      ...user,
      tokens: { acces_token: accessToken },
    };
  }
}
