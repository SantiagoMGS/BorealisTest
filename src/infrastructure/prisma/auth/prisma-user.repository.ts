import { Injectable } from '@nestjs/common';
import { IUserRepository } from 'src/core/domain/repositories/user.repository';
import { PrismaService } from '../prisma.service';
import { User } from 'src/core/domain/entities/user.entity';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(user: User): Promise<User> {
    return this.prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async deleteUser(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  async findAll(page: number, limit: number): Promise<{ users: Omit<User, 'password'>[], total: number }> {
    const users = await this.prisma.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      select: { id: true, name: true, email: true, isActive: true, createdAt: true, updateAt: true }, // Excluye password
    });

    const total = await this.prisma.user.count();

    return { users, total };
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: userData,
    });
  }

  // 🔹 Implementación del nuevo método para asociar usuario con compañías
  async assignUserToCompanies(userId: string, companyIds: string[]): Promise<void> {
    await this.prisma.userCompany.createMany({
      data: companyIds.map(companyId => ({
        userId,
        companyId,
      })),
      skipDuplicates: true, // Evita errores si ya existe la relación
    });
  }
}
