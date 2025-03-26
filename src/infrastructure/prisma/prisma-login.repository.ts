import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { User } from 'src/core/domain/entities';
import { ILoginRepository } from 'src/core/domain/repositories/login.repository';

@Injectable()
export class PrismaLoginRepository implements ILoginRepository {
  constructor(private readonly prisma: PrismaService) { }


  async findByEmailWithPassword(email: string): Promise<Omit<User, | 'refreshToken' | 'refreshTokenExpired'>> {

    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        password: true,
        email: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<Omit<User, 'password' | 'refreshToken' | 'refreshTokenExpired'>> {
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

    return user;
  }

  async getCompanyByUserId(
    userId: string,
  ): Promise<{ companyId: string; companyName: string; logo: string }[]> {
    const userCompanies = await this.prisma.userCompany.findMany({
      where: { userId },
      select: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
            primaryColor: true,
            secondaryColor: true,
            thirdColor: true,
          },
        },
      },
    });

    return userCompanies.map(({ company }) => ({
      companyId: company.id,
      companyName: company.name,
      logo: company.logo,
      primaryColor: company.primaryColor,
      secondaryColor: company.secondaryColor,
      thirdColor: company.thirdColor,
    }));
  }

}


