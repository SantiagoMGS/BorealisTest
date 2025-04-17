import { ILoginEntity } from '@domain/entities/login.entity';

export abstract class LoginRepository {
  abstract login(loginData: ILoginEntity): Promise<any>;
}
