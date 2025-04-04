
import { Inject, Injectable } from '@nestjs/common';
import { UserPermissionsEntity } from '../../entities/user-permissions.entity';
import { IUserRepository } from '../../repositories';

@Injectable()
export class GetUserPermissionsUseCase {
  constructor(@Inject('IUserRepository') private readonly userRepository: IUserRepository) { }

  async execute(id: string): Promise<UserPermissionsEntity[]> {
    return this.userRepository.getUserPermissions(id);
  }
}
