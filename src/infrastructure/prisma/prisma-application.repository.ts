import { ConflictException, Injectable } from '@nestjs/common';
import { Application } from 'src/core/domain/entities';
import { IApplicationRepository } from 'src/core/domain/repositories/application.repository';
import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaApplicationRepository implements IApplicationRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: Application): Promise<Application> {
    try {

      const created = await this.prisma.application.create({
        data: {
          name: data.name,
          isActive: data.isActive,
          logo: data.logo ?? '',
          path: data.path,
        },
      });

      return {
        id: created.id,
        name: created.name,
        isActive: created.isActive,
        logo: created.logo,
        path: created.path,
      };
    } catch (error) {
      throw new ConflictException('La aplicación ya existe.');
    }
  }
  async update(id: string, data: Partial<Application>): Promise<Application> {
    const updated = await this.prisma.application.update({
      where: { id },
      data,
    });

    return {
      id: updated.id,
      name: updated.name,
      isActive: updated.isActive,
      logo: updated.logo,
      path: updated.path,
    };
  }

  async delete(id: string): Promise<void> {
    await this.prisma.application.delete({ where: { id } });
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
  async findAll(page = 1, limit = 10): Promise<{ data: Application[]; total: number }> {
    const skip = (page - 1) * limit;
    const [apps, total] = await Promise.all([
      this.prisma.application.findMany({ skip, take: limit }),
      this.prisma.application.count(),
    ]);

    return {
      data: apps.map((app) => ({
        id: app.id,
        name: app.name,
        isActive: app.isActive,
        logo: app.logo,
        path: app.path,
      })),
      total,
    };
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
