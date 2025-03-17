import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { IApplicationRepository } from 'src/core/domain/repositories/application.repository';
import { Application } from 'src/core/domain/entities/application.entity';

@Injectable()
export class PrismaApplicationRepository implements IApplicationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createApplication(applications: Application[]): Promise<Application[]> {
    try {
      await this.prisma.aplications.createMany({
        data: applications.map((action) => ({
          name: action.name,
          isActive: action.isActive,
        })),
        skipDuplicates: true,
      });

      return await this.prisma.aplications.findMany({
        where: {
          name: { in: applications.map((action) => action.name) },
        },
      });
    } catch (error) {
      throw new ConflictException('Algunas acciones ya existen.');
    }
  }

  // 🔹 Implementación del método findById
  async findById(applicationId: string): Promise<Application | null> {
    return this.prisma.aplications.findUnique({
      where: { id: applicationId },
    });
  }

  // 🔹 Implementación del método findManyByIds
  async findManyByIds(applicationIds: string[]): Promise<Application[]> {
    return this.prisma.aplications.findMany({
      where: {
        id: { in: applicationIds },
      },
    });
  }

  async findByName(name: string): Promise<Application | null> {
    return this.prisma.aplications.findUnique({
      where: { name },
    });
  }
}
