import { AuthLoginRepository } from '@domain/repositories/auth/auth-login.repository';
import { LoginDto } from '@presentation/controller/auth/dtos/login.dto';
import { AuthLoginDataSourceService } from 'src/infraestructure/datasource/auth/auth-login.dataosurce.service';

export class AuthLoginRepositoryImpService implements AuthLoginRepository {
  constructor(
    private readonly authLoginDataSourceService: AuthLoginDataSourceService,
  ) {}
  async login(loginDto: LoginDto): Promise<any> {
    const user = await this.authLoginDataSourceService.login(loginDto);
    return user;
  }
}
