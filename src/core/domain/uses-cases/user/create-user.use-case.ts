import { ForbiddenException, Inject, Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IUserRepository } from '../../repositories/user.repository';
import { ICompanyRepository } from '../../repositories/company.repository';
import { CreateUserDto } from 'src/presentation/controllers/user/dtos/create-user.dto';
import { User } from '../../entities/user.entity';

@Injectable()
export class CreateUserUseCase {
  private readonly logger = new Logger(CreateUserUseCase.name);

  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    @Inject('ICompanyRepository') private readonly companyRepository: ICompanyRepository,
  ) { }

  async execute(userDto: CreateUserDto): Promise<User> {
    
    try {
      const existingUser = await this.userRepository.findByEmail(userDto.email);
      if (existingUser) {
        throw new ForbiddenException(`El email "${userDto.email}" ya esta en uso.`);
      }

      const companies = await this.companyRepository.findManyByIds(userDto.companyIds);
      if (companies.length !== userDto.companyIds.length) {
        throw new ForbiddenException('Algunas compañías no existen');
      }

      const hashedPassword = await bcrypt.hash(userDto.password, 10);

      const newUser = await this.userRepository.createUser(
        new User('', userDto.name, userDto.email, hashedPassword),
      );

      await this.userRepository.assignUserToCompanies(newUser.id, userDto.companyIds, userDto.roleId);
      this.logger.log('User created successfully');
      return newUser;
    } catch (error) {
      this.logger.error('Failed to create user', error.stack);
      throw error;
    }
  }
}