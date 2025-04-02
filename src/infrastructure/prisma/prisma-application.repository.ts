import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { IApplicationRepository } from 'src/core/domain/repositories/application.repository';
import { Application } from 'src/core/domain/entities';

@Injectable()
export class PrismaApplicationRepository implements IApplicationRepository {
  constructor(private readonly prisma: PrismaService) { }

  async createApplication(applications: Application[]): Promise<Application[]> {
    try {
      await this.prisma.application.createMany({
        data: applications.map((app) => ({
          name: app.name,
          isActive: app.isActive,
          logo: app.logo ?? '',

        })),
        skipDuplicates: true,
      });

      return (await this.prisma.application.findMany({
        where: {
          name: { in: applications.map((app) => app.name) },
        },
      })).map((app) => new Application(app.id, app.name, app.isActive, app.logo));

    } catch (error) {
      throw new ConflictException('Algunas acciones ya existen.');
    }
  }

  // 🔹 Implementación del método findById
  async findById(applicationId: string): Promise<Application | null> {
    const found = await this.prisma.application.findUnique({
      where: { id: applicationId },
    });
  
    return found
      ? new Application(found.id, found.name, found.isActive, found.logo)
      : null;
  }
  

  // 🔹 Implementación del método findManyByIds
  async findManyByIds(applicationIds: string[]): Promise<Application[]> {
    const apps = await this.prisma.application.findMany({
      where: {
        id: { in: applicationIds },
      },
    });
  
    return apps.map((app) => new Application(app.id, app.name, app.isActive, app.logo));
  }
  

  async findByName(name: string): Promise<Application | null> {
    const found = await this.prisma.application.findUnique({
      where: { name },
    });
  
    return found
      ? new Application(found.id, found.name, found.isActive, found.logo)
      : null;
  }
  
}
