import { IUserEntity } from '@domain/entities/user/user.entity';
import { IUserResponse } from '@domain/interfaces/user/user-response.interface';

export abstract class UserRepository {
  abstract createUser(userData: IUserEntity): Promise<IUserResponse>;
  abstract getUserById(id: string): Promise<IUserResponse | null>;
  abstract getUserByEmail(email: string): Promise<IUserResponse | null>;
}
