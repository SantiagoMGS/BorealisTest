import { ILoginEntity } from '@domain/entities/login.entity';
import { ILoginResponse } from '@domain/interfaces/auth/login-response.interface';
import { Injectable } from '@nestjs/common';
import { LoginRepository } from '@domain/repositories/auth/login.repository';

@Injectable()
export class LoginUseCase {
  constructor(private readonly loginRepository: LoginRepository) {}

  async execute(loginData: ILoginEntity): Promise<ILoginResponse> {
    return await this.loginRepository.login(loginData);
  }
}
