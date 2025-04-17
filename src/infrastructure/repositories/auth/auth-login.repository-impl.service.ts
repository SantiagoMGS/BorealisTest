import { Injectable } from '@nestjs/common';
import { LoginRepository } from '@domain/repositories/auth/login.repository';
import { LoginDataSourceService } from '@infrastructure/datasource/auth/auth-login.dataosurce.service';
import { ILoginEntity } from '@domain/entities/login.entity';

@Injectable()
export class LoginRepositoryImplService implements LoginRepository {
  constructor(
    private readonly loginDataSourceService: LoginDataSourceService,
  ) {}
  async login(loginData: ILoginEntity): Promise<any> {
    const user = await this.loginDataSourceService.login(loginData);
    return user;
  }
}
