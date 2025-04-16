import { Injectable } from '@nestjs/common';
import { AuthLoginRepository } from '@domain/repositories/auth/auth-login.repository';
import { AuthLoginDataSourceService } from '@infrastructure/datasource/auth/auth-login.dataosurce.service';
import { LoginDto } from '@presentation/controller/auth/dto/login.dto';

@Injectable()
export class AuthLoginRepositoryImpService implements AuthLoginRepository {
  constructor(
    private readonly authLoginDataSourceService: AuthLoginDataSourceService,
  ) {}
  async login(loginDto: LoginDto): Promise<any> {
    console.log('En AuthLoginRepositoryImpService.login');
    const user = await this.authLoginDataSourceService.login(loginDto);
    return user;
  }
}
