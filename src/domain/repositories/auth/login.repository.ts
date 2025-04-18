import { ILoginEntity } from '@domain/entities/auth/login.entity';

export abstract class LoginRepository {
  abstract login(loginData: ILoginEntity): Promise<any>;
}
