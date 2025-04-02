import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { User } from 'src/core/domain/entities';
import { ILoginRepository } from 'src/core/domain/repositories/login.repository';

@Injectable()
export class PrismaLoginRepository implements ILoginRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmailWithPassword(email: string): Promise<Omit<User, 'refreshToken' | 'refreshTokenExpired'>> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        hashedPassword: true,
        email: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return new User(
      user.id,
      user.name,
      user.email,
      user.hashedPassword,
      user.isActive,
      user.createdAt,
      user.updatedAt
    );
  }

  async findByEmail(email: string): Promise<Omit<User, 'hashedPassword' | 'refreshToken' | 'refreshTokenExpired'>> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return new User(
      user.id,
      user.name,
      user.email,
      '', // omitimos la contraseña
      user.isActive,
      user.createdAt,
      user.updatedAt
    );
  }

  async getCompanyByUserId(userId: string): Promise<
  {
    id: string;
    name: string;
    branding: {
      logo: string | null;
      primaryColor: string | null;
      secondaryColor: string | null;
      tertiaryColor: string | null;
    } | null;
  }[]
> {
  const results = await this.prisma.userCompany.findMany({
    where: { userId },
    select: {
      company: {
        select: {
          id: true,
          name: true,
          branding: {
            select: {
              logo: true,
              primaryColor: true,
              secondaryColor: true,
              tertiaryColor: true,
            },
          },
        },
      },
    },
  });

  return results.map((item) => ({
    id: item.company.id,
    name: item.company.name,
    branding: item.company.branding,
  }));
}

}
