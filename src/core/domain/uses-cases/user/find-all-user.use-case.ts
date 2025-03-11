import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../../repositories/user.repository';
import { User } from '../../entities/user.entity';


@Injectable()
export class FindAllUsersUseCase {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) { }

  async execute(page: number, limit: number): Promise<{ users: Omit<User, 'password'>[]; total: number }> {
    return this.userRepository.findAll(page, limit);
  }
}