import { Inject, Injectable, ForbiddenException } from '@nestjs/common';
import { IUserRepository } from '../../repositories/user.repository';
import { User } from '@prisma/client';

@Injectable()
export class FindUserUseCase {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}

  async execute(email: string): Promise<User | null> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ForbiddenException('El email ya está en uso');
    }
    return existingUser;
  }
}
