import { Inject, Injectable, Logger } from '@nestjs/common';
import { IUserRepository } from '../../repositories/user.repository';
import { User } from '../../entities';


@Injectable()
export class FindAllUsersUseCase {
  private readonly logger = new Logger(FindAllUsersUseCase.name);

  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) { }

  async execute(page: number, limit: number): Promise<{ users: Omit<User, 'password'>[]; total: number }> {
    this.logger.log(`Getting all users with page: ${page}, limit: ${limit}`);
    try {
      return this.userRepository.findAll(page, limit);

    } catch (error) {
      this.logger.error('Failed to get all users', error.stack);
      throw error;
    }
  }
}