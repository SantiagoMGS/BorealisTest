import { IAuthLoginEntity } from '@domain/entities/auth-login.entity';
import { Injectable } from '@nestjs/common';
import { AuthLoginRepository } from 'src/domain/repositories/auth/auth-login.repository';

@Injectable()
export class AuthLoginUseCase {
  constructor(private readonly authLoginRepository: AuthLoginRepository) {}

  async execute(loginData: IAuthLoginEntity): Promise<any> {
    const user = await this.authLoginRepository.login(loginData);
    return user;
  }
}
