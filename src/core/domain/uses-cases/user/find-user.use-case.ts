import { Inject, Injectable, Logger } from '@nestjs/common';
import { User } from '@prisma/client';
import { TOKENS } from '../../../../presentation/module/tokens.constants';
import { IUserRepository } from '../../repositories/user.repository';
import { UpdateUserUseCase } from './update-user.use-case';

@Injectable()
export class FindUserUseCase {
  private readonly logger = new Logger(UpdateUserUseCase.name)
  constructor(
    @Inject(TOKENS.USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {

  }
  async execute(email: string): Promise<Omit<User, 'hashedPassword'> | null> {
    try {
      this.logger.log(`Finding user by email: ${email}`);

      const existingUser = await this.userRepository.findByEmail(email);
      if (!existingUser) {
        this.logger.log(`User with email ${email} not found.`);
        return null;
      }

      this.logger.log(`User with email ${email} found.`);
      return {
        id: existingUser.id || '',
        name: existingUser.name,
        email: existingUser.email,
        isActive: existingUser.isActive,
        createdAt: existingUser.createdAt || new Date(),
        updatedAt: existingUser.updatedAt || new Date(),
      }; // Exclude hashedPassword
    } catch (error) {
      this.logger.error(`Failed to find user by email: ${email}`, (error as Error).stack);
      throw error;
    }
  }

}
