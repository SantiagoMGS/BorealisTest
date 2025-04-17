import { Injectable } from '@nestjs/common';
import { LoginRepository } from '@domain/repositories/auth/login.repository';
import { AuthLoginDataSourceService } from '@infrastructure/datasource/auth/auth-login.dataosurce.service';
import { LoginDto } from '@presentation/controller/auth/dto/login.dto';

@Injectable()
export class AuthLoginRepositoryImpService implements LoginRepository {
  constructor(
    private readonly authLoginDataSourceService: AuthLoginDataSourceService,
  ) {}
  async login(loginDto: LoginDto): Promise<any> {
    const user = await this.authLoginDataSourceService.login(loginDto);
    return user;
  }
}
