import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IUserRepository } from '../../repositories/user.repository';
import { ICompanyRepository } from '../../repositories/company.repository';
import { CreateUserDto } from 'src/presentation/controllers/dtos/create-user.dto';
import { User } from '../../entities/user.entity';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    @Inject('ICompanyRepository') private readonly companyRepository: ICompanyRepository,
  ) { }

  async execute(userDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(userDto.email);
    if (existingUser) {
      throw new ForbiddenException('El email ya está en uso');
    }

    const companies = await this.companyRepository.findManyByIds(userDto.companyIds);
    if (companies.length !== userDto.companyIds.length) {
      throw new ForbiddenException('Algunas compañías no existen');
    }

    const hashedPassword = await bcrypt.hash(userDto.password, 10);

    const newUser = await this.userRepository.createUser(
      new User('', userDto.name, userDto.email, hashedPassword),
    );

    await this.userRepository.assignUserToCompanies(newUser.id, userDto.companyIds);

    return newUser; 
  }
}
