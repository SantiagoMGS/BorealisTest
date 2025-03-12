import { Inject, Injectable, Logger } from '@nestjs/common';
import { User } from '@prisma/client';
import { IUserRepository } from '../../repositories/user.repository';

@Injectable()
export class UpdateUserUseCase {
  private readonly logger = new Logger(UpdateUserUseCase.name);

  constructor(@Inject('IUserRepository') private readonly userRepository: IUserRepository) { }

  async execute(email: string, userData: Partial<User>): Promise<Omit<User, 'isActive' | 'createdAt' | 'updatedAt' | 'password'>> {
    this.logger.log(`Updating user email: ${email}`);

    try {
      const updatedUser = await this.userRepository.update(email, userData);
      this.logger.log(`User email: ${email} updated successfully`);
      const { password, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword;
    } catch (error) {
      this.logger.error(`Failed to update user email: ${email}`, error.stack);
      throw error;
    }
  }
}