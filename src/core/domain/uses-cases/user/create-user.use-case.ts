
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { IUserRepository } from '../../repositories/user.repository';
import { CreateUserDto } from 'src/presentation/controllers/dtos/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CreateUserUseCase {
  constructor(@Inject('IUserRepository') private readonly userRepository: IUserRepository) { }


  async execute(userDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(userDto.password, 10);

    const newUser = new User(
      crypto.randomUUID(),
      userDto.name,
      userDto.email,
      hashedPassword
    );
    return this.userRepository.createUser(newUser);
  }
}