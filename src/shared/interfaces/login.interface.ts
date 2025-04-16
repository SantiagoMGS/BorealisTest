import { IAuthLoginEntity } from '@domain/entities/auth-login.entity';

export interface ILogin {
  login(loginData: IAuthLoginEntity): Promise<any>;
}
