import { ConflictException, Injectable } from '@nestjs/common';
import { Application } from 'src/core/domain/entities';
import { IApplicationRepository } from 'src/core/domain/repositories/application.repository';
import { PrismaService } from './prisma.service';

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
          path: app.path

        })),
        skipDuplicates: true,
      });

      return (await this.prisma.application.findMany({
        where: {
          name: { in: applications.map((app) => app.name) },
        },
      })).map((app) => ({
        id: app.id,
        name: app.name,
        isActive: app.isActive,
        logo: app.logo,
        path: app.path,
      }));


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
      ? {
        id: found.id,
        name: found.name,
        isActive: found.isActive,
        logo: found.logo,
        path: found.path,
      }
      : null;
  }


  // 🔹 Implementación del método findManyByIds
  async findManyByIds(applicationIds: string[]): Promise<Application[]> {
    const apps = await this.prisma.application.findMany({
      where: {
        id: { in: applicationIds },
      },
    });

    return apps.map((app) => ({
      id: app.id,
      name: app.name,
      isActive: app.isActive,
      logo: app.logo,
      path: app.path,
    }));
  }


  async findByName(name: string): Promise<Application | null> {
    const found = await this.prisma.application.findUnique({
      where: { name },
    });
    return found
      ? {
        id: found.id,
        name: found.name,
        isActive: found.isActive,
        logo: found.logo,
        path: found.path,
      }
      : null;

  }

}
