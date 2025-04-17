import { ILoginEntity } from '@domain/entities/login.entity';
import { ILogin } from '@shared/interfaces/login.interface';

export abstract class LoginRepository implements ILogin {
  abstract login(loginData: ILoginEntity): Promise<any>;
}
