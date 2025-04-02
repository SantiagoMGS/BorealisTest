import { Inject, Injectable, Logger } from '@nestjs/common';
import { IUserRepository } from '../../repositories/user.repository';
import { User } from '../../entities';

@Injectable()
export class UpdateUserUseCase {
  private readonly logger = new Logger(UpdateUserUseCase.name);

  constructor(@Inject('IUserRepository') private readonly userRepository: IUserRepository) { }

  async execute(email: string, userData: Partial<User>): Promise<Omit<User, 'isActive' | 'createdAt' | 'updatedAt' | 'hashedPassword'>> {
    this.logger.log(`Updating user email: ${email}`);

    try {
      const updatedUser = await this.userRepository.update(email, userData);
      this.logger.log(`User email: ${email} updated successfully`);
      const { hashedPassword, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword;
    } catch (error: unknown) {
      this.logger.error(`Failed to update user email: ${email}`, (error as Error).stack);
      throw error;
    }
  }
}