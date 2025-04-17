import { ILoginEntity } from '@domain/entities/login.entity';
import { Injectable } from '@nestjs/common';
import { LoginRepository } from '@domain/repositories/auth/login.repository';

@Injectable()
export class LoginUseCase {
  constructor(private readonly loginRepository: LoginRepository) {}

  async execute(loginData: ILoginEntity): Promise<any> {
    const user = await this.loginRepository.login(loginData);
    return user;
  }
}
