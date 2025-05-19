import { ILoginEntity } from '@domain/entities/auth/login.entity';
import { ILogin } from '@domain/interfaces/auth/login-response.interface';

export abstract class LoginRepository {
  abstract login(loginData: ILoginEntity): Promise<ILogin>;
}
