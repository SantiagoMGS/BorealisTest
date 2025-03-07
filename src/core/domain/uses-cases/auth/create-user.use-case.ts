
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { IUserRepository } from '../../repositories/user.repository';
import { CreateUserDto } from 'src/presentation/controllers/auth/dtos/create-user.dto';
@Injectable() 
export class CreateUserUseCase {
  constructor(@Inject('IUserRepository') private readonly userRepository: IUserRepository) {}


  async execute(userDto: CreateUserDto): Promise<User> {
      const newUser = new User(
        crypto.randomUUID(), 
        userDto.name,
        userDto.email,
        userDto.password,
      );
      return this.userRepository.createUser(newUser);
    }
}