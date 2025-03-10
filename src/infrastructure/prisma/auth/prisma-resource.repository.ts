import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { IResourceRepository } from 'src/core/domain/repositories/resource.repository';
import { Resource } from 'src/core/domain/entities/resource.entity';

@Injectable()
export class PrismaResourceRepository implements IResourceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createResource(resource: Resource): Promise<Resource> {
    try {
      const createdResource = await this.prisma.resource.create({
        data: { name: resource.name },
      });
      return new Resource(createdResource.id, createdResource.name);
    } catch (error) {
      throw new ConflictException(`El recurso "${resource.name}" ya existe.`);
    }
  }

  async findById(resourceId: string): Promise<Resource | null> {
    const resource = await this.prisma.resource.findUnique({ where: { id: resourceId } });
    return resource ? new Resource(resource.id, resource.name) : null;
  }

  async deleteResource(id: string): Promise<void> {
    const resource = await this.findById(id);
    if (!resource) throw new NotFoundException('Recurso no encontrado');
    await this.prisma.resource.delete({ where: { id } });
  }

  async findAll(page: number, limit: number): Promise<{ resources: Resource[]; total: number }> {
    const skip = (page - 1) * limit;

    const [resources, total] = await Promise.all([
      this.prisma.resource.findMany({
        skip,
        take: limit,
        select: { id: true, name: true },
      }),
      this.prisma.resource.count(),
    ]);

    return { resources, total };
  }

  async updateResource(id: string, resourceData: Partial<Resource>): Promise<Resource> {
    const existingResource = await this.findById(id);
    if (!existingResource) throw new NotFoundException(`Recurso con ID ${id} no encontrado`);

    const updatedResource = await this.prisma.resource.update({
      where: { id },
      data: { name: resourceData.name },
    });

    return new Resource(updatedResource.id, updatedResource.name);
  }
}
