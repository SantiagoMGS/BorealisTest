import { Injectable } from '@nestjs/common';
import { UserRepository } from '@domain/repositories/user/user.repository';
import { UserDataSourceService } from '@infrastructure/datasource/user/user.datasource.service';
import { IUserEntity } from '@domain/entities/user/user.entity';
import { IUserResponse } from '@domain/interfaces/user/user-response.interface';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly userDataSource: UserDataSourceService) {}

  async createUser(userData: IUserEntity): Promise<IUserResponse> {
    const createdUser = await this.userDataSource.createUser(userData);

    return {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      isActive: createdUser.isActive,
      createdAt: createdUser.createdAt,
      updatedAt: createdUser.updatedAt,
    };
  }

  async getUserById(id: string): Promise<IUserResponse | null> {
    const user = await this.userDataSource.getUserById(id);

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async getUserByEmail(email: string): Promise<IUserResponse | null> {
    const user = await this.userDataSource.getUserByEmail(email);

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
