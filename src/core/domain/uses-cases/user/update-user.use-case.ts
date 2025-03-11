import { Inject, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { IUserRepository } from '../../repositories/user.repository';


@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject('IUserRepository') 
    private readonly userRepository: IUserRepository,
  ) {}


  async execute(id: string, userData: Partial<User>): Promise<Omit<User,'isActive'|'createdAt'|'updatedAt'>> {
    return this.userRepository.update(id, userData) ;
  }
}