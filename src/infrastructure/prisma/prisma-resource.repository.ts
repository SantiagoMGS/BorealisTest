import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Resource } from 'src/core/domain/entities';
import { IResourceRepository } from 'src/core/domain/repositories/resource.repository';
import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaResourceRepository implements IResourceRepository {
  constructor(private readonly prisma: PrismaService) { }

  async createResource(resource: Resource): Promise<Resource> {
    try {
      const createdResource = await this.prisma.resource.create({
        data: { name: resource.name, icon: resource.icon, path: resource.path },
      });

      return {
        id: createdResource.id,
        name: createdResource.name,
        icon: createdResource.icon,
        path: createdResource.path,
      };
    } catch (error) {
      throw new ConflictException(`El recurso "${resource.name}" ya existe.`);
    }
  }

  async findById(resourceId: string): Promise<Resource | null> {
    const resource = await this.prisma.resource.findUnique({
      where: { id: resourceId },
    });
    return resource
      ? {
        id: resource.id,
        name: resource.name,
        icon: resource.icon,
        path: resource.path,
      }
      : null;
  }

  async deleteResource(id: string): Promise<void> {
    const resource = await this.findById(id);
    if (!resource) throw new NotFoundException('Recurso no encontrado');
    await this.prisma.resource.delete({ where: { id } });
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<{ resources: Resource[]; total: number }> {
    const skip = (page - 1) * limit;

    const [resources, total] = await Promise.all([
      this.prisma.resource.findMany({
        skip,
        take: limit,
        select: { id: true, name: true, icon: true, path: true },
      }),
      this.prisma.resource.count(),
    ]);

    return {
      resources: resources.map((r) => ({
        id: r.id,
        name: r.name,
        icon: r.icon,
        path: r.path,
      })),
      total,
    };
  }

  async updateResource(
    id: string,
    resourceData: Partial<Resource>,
  ): Promise<Resource> {
    const existingResource = await this.findById(id);
    if (!existingResource)
      throw new NotFoundException(`Recurso con ID ${id} no encontrado`);

    const updatedResource = await this.prisma.resource.update({
      where: { id },
      data: { name: resourceData.name },
    });

    return {
      id: updatedResource.id,
      name: updatedResource.name,
      icon: updatedResource.icon,
      path: updatedResource.path,
    };
  }

  async findByName(name: string): Promise<Resource | null> {
    const resource = await this.prisma.resource.findUnique({ where: { name } });
    return resource
      ? {
        id: resource.id,
        name: resource.name,
        icon: resource.icon,
        path: resource.path,
      }
      : null;

  }
}
