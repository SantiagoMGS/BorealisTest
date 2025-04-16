import { LoginDto } from '@presentation/controller/auth/dtos/login.dto';

export interface ILogin {
  login(loginDto: LoginDto): Promise<any>;
}
