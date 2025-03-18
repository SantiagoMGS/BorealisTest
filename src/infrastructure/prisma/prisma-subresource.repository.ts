import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ISubResourceRepository } from 'src/core/domain/repositories/subresource.reposiroty';
import { SubResource } from 'src/core/domain/entities';

@Injectable()
export class PrismaSubResourceRepository implements ISubResourceRepository {
  constructor(private readonly prisma: PrismaService) { }
  async createSubResource(subResource: SubResource): Promise<SubResource> {
    try {
      const createdSubResource = await this.prisma.subresource.create({
        data: {
          name: subResource.name,
          resourceId: subResource.resourceId,
        },
      });
      return new SubResource(createdSubResource.id, createdSubResource.name, createdSubResource.resourceId);
    } catch (error) {
      throw new ConflictException(`El subrecurso "${subResource.name}" ya existe.`);
    }
  }

  async findByName(name: string): Promise<SubResource | null> {
    const subresource = await this.prisma.subresource.findFirst({ where: { name: name } })
    return subresource;
  }

  /* async findById(resourceId: string): Promise<Resource | null> {
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
    */
}
