import { Module } from '@nestjs/common';
import {
  CreateUserUseCase,
  DeleteUserUseCase,
  FindAllUsersUseCase,
  FindUserUseCase,
  GetUserPermissionsByCompanyUseCase,
  GetUserPermissionsUseCase,
  UpdateUserCompanyRoleUseCase,
  UpdateUserUseCase,
} from 'src/core/domain/uses-cases';
import { UserController } from '../../controllers/user/user.controller';
import { RepositoryModule } from '../repository.module';

@Module({
  imports: [RepositoryModule],
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    FindAllUsersUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    FindUserUseCase,
    UpdateUserCompanyRoleUseCase,
    GetUserPermissionsUseCase,
    GetUserPermissionsByCompanyUseCase,
  ],
  exports: [
    CreateUserUseCase,
    FindAllUsersUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    FindUserUseCase,
    UpdateUserCompanyRoleUseCase,
    GetUserPermissionsUseCase,
    GetUserPermissionsByCompanyUseCase,
  ],
})
export class UserModule {}
