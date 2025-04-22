import { Injectable, ConflictException } from '@nestjs/common';
import { IUserEntity } from '@domain/entities/user/user.entity';
import { IUserResponse } from '@domain/interfaces/user/user-response.interface';
import { UserRepository } from '@domain/repositories/user/user.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    userData: IUserEntity,
    adminId?: string,
  ): Promise<IUserResponse> {
    // Verificar si el usuario ya existe
    const existingUser = await this.userRepository.getUserByEmail(
      userData.email,
    );
    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // Preparar los datos del usuario
    const userToCreate: IUserEntity = {
      ...userData,
      password: hashedPassword,
      isActive: userData.isActive !== undefined ? userData.isActive : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Asignar creador si se proporciona el ID del administrador
    if (adminId) {
      userToCreate.createdBy = adminId;
      userToCreate.updatedBy = adminId;
    }

    // Crear el usuario en la base de datos
    return this.userRepository.createUser(userToCreate);
  }
}
