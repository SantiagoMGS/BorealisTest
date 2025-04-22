import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@core/prisma/prisma.service';
import { User } from '@prisma/client';
import { IUserEntity } from '@domain/entities/user/user.entity';

@Injectable()
export class UserDataSourceService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(userData: IUserEntity): Promise<User> {
    return this.prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        hashedPassword: userData.password,
        isActive: userData.isActive ?? true,
        createdAt: userData.createdAt ?? new Date(),
        updatedAt: userData.updatedAt ?? new Date(),
      },
    });
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }

    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    return user;
  }
}
