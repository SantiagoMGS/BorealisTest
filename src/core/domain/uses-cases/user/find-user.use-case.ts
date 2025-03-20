import { Inject, Injectable, ForbiddenException, Logger } from '@nestjs/common';
import { IUserRepository } from '../../repositories/user.repository';
import { User } from '@prisma/client';
import { UpdateUserUseCase } from './update-user.use-case';

@Injectable()
export class FindUserUseCase {
  private readonly logger = new Logger(UpdateUserUseCase.name)
  constructor(@Inject('IUserRepository') private readonly userRepository: IUserRepository,) {

  }
  async execute(email: string): Promise<User | null> {

    try {

      this.logger.log(`Finding user by email: ${email}`);

      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        throw new ForbiddenException('El email ya está en uso');
      }
      return existingUser;
    } catch (error) {
      this.logger.error(`Failed to find user by email: ${email}`, (error as Error).stack);
      throw error;
    }
  }

}
