import { Inject, Injectable, Logger } from '@nestjs/common';
import { User } from '@prisma/client';
import { IUserRepository } from '../../repositories/user.repository';

@Injectable()
export class UpdateUserUseCase {
  private readonly logger = new Logger(UpdateUserUseCase.name);

  constructor(@Inject('IUserRepository') private readonly userRepository: IUserRepository) { }

  async execute(id: string, userData: Partial<User>): Promise<Omit<User, 'isActive' | 'createdAt' | 'updatedAt' | 'password'>> {
    this.logger.log(`Updating user ID: ${id}`);

    try {
      const updatedUser = await this.userRepository.update(id, userData);
      this.logger.log(`User ID: ${id} updated successfully`);
      const { password, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword;
    } catch (error) {
      this.logger.error(`Failed to update user ID: ${id}`, error.stack);
      throw error;
    }
  }
}