import { LoginDto } from '@presentation/controller/auth/dtos/login.dto';
import { ILogin } from '@shared/interfaces/login.interface';

export abstract class AuthLoginRepository implements ILogin {
  abstract login(loginDto: LoginDto): Promise<any>;
}
