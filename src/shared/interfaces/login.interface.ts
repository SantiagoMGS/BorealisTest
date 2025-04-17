import { ILoginEntity } from '@domain/entities/login.entity';

export interface ILogin {
  login(loginData: ILoginEntity): Promise<any>;
}
