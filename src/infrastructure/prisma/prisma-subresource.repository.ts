import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Subresource } from 'src/core/domain/entities';
import { ISubResourceRepository } from 'src/core/domain/repositories/subresource.reposiroty';
import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaSubResourceRepository implements ISubResourceRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(subResource: Subresource): Promise<Subresource> {
    try {

      const created = await this.prisma.subresource.create({
        data: {
          name: subResource.name,
          icon: subResource.icon,
          path: subResource.path,
          resourceId: subResource.resourceId!,
        },
      });

      return {
        id: created.id,
        name: created.name,
        icon: created.icon,
        path: created.path,
        resourceId: created.resourceId,
        createdAt: created.createdAt,
        updatedAt: created.updatedAt,
      };
    } catch (error) {
      throw new ConflictException(`El subrecurso "${subResource.name}" ya existe o falló.`);
    }
  }

  async update(id: string, data: Partial<Subresource>): Promise<Subresource> {
    const existing = await this.prisma.subresource.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Subrecurso con ID ${id} no encontrado`);

    const updated = await this.prisma.subresource.update({
      where: { id },
      data: {
        ...Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined && v !== null)),
      },
    });

    return {
      id: updated.id,
      name: updated.name,
      icon: updated.icon,
      path: updated.path,
      resourceId: updated.resourceId,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }

  async delete(id: string): Promise<void> {
    await this.prisma.subresource.delete({ where: { id } });
  }

  async findByName(name: string): Promise<Subresource | null> {
    const found = await this.prisma.subresource.findFirst({ where: { name } });

    return found
      ? {
        id: found.id,
        name: found.name,
        icon: found.icon,
        path: found.path,
        resourceId: found.resourceId,
        createdAt: found.createdAt,
        updatedAt: found.updatedAt,
      }
      : null;
  }
}
