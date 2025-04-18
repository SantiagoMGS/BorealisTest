import { ILoginEntity } from '@domain/entities/auth/login.entity';
import { ILoginResponse } from '@domain/interfaces/auth/login-response.interface';
import { Injectable } from '@nestjs/common';
import { LoginRepository } from '@domain/repositories/auth/login.repository';
import { AuthSessionManagementUseCase } from './auth-session-management.use-case';
import { Request } from 'express';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly loginRepository: LoginRepository,
    private readonly authSessionManagementUseCase: AuthSessionManagementUseCase,
  ) {}

  async execute(
    loginData: ILoginEntity,
    req?: Request,
  ): Promise<ILoginResponse> {
    const user = await this.loginRepository.login(loginData);

    const deviceInfo = req?.headers['user-agent'];
    // Crear sesión única e invalidar las anteriores
    const tokens = await this.authSessionManagementUseCase.createSession(
      user.id,
      deviceInfo!,
    );
    return {
      ...user,
      tokens: {
        access_token: tokens.token,
        refresh_token: tokens.refreshToken,
      },
    };
  }
}
