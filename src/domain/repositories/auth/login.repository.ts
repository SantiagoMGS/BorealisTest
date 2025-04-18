import { ILoginEntity } from '@domain/entities/login.entity';
import { ILoginResponse } from '@domain/interfaces/auth/login-response.interface';

export abstract class LoginRepository {
  abstract login(loginData: ILoginEntity): Promise<ILoginResponse>;
}
