import { Inject, Injectable, Logger } from '@nestjs/common';
import { User } from '../../entities';
import { IUserRepository } from '../../repositories/user.repository';


@Injectable()
export class FindAllUsersUseCase {
  private readonly logger = new Logger(FindAllUsersUseCase.name);

  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) { }

  async execute(page: number, limit: number): Promise<{ users: Omit<User, 'hashedPassword'>[]; total: number }> {
    this.logger.log(`Getting all users with page: ${page}, limit: ${limit}`);
    try {
      const result = await this.userRepository.findAll(page, limit);
      return {
        users: result.data.map(user => {
          const { hashedPassword, ...rest } = user;
          return rest;
        }),
        total: result.total,
      };

    } catch (error) {
      this.logger.error('Failed to get all users', (error as Error).stack);
      throw error;
    }
  }
}