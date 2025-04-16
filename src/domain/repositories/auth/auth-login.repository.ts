import { IAuthLoginEntity } from '@domain/entities/auth-login.entity';
import { ILogin } from '@shared/interfaces/login.interface';

export abstract class AuthLoginRepository implements ILogin {
  abstract login(loginData: IAuthLoginEntity): Promise<any>;
}
