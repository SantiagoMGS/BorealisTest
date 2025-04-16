import { Injectable } from '@nestjs/common';
import { AuthLoginRepository } from 'src/domain/repositories/auth/auth-login.repository';
import { LoginDto } from 'src/presentation/controller/auth/dtos/login.dto';

@Injectable()
export class AuthLoginUseCase {
  constructor(private readonly authLoginRepository: AuthLoginRepository) {}

  async execute(loginDto: LoginDto) {
    const user = await this.authLoginRepository.login(loginDto);
  }
}
