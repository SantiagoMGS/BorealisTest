import { ConflictException, Injectable } from '@nestjs/common';
import { Subresource } from 'src/core/domain/entities';
import { ISubResourceRepository } from 'src/core/domain/repositories/subresource.reposiroty';
import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaSubResourceRepository implements ISubResourceRepository {
  constructor(private readonly prisma: PrismaService) { }

  async createSubResource(subResource: Subresource): Promise<Subresource> {
    try {
      const created = await this.prisma.subresource.create({
        data: {
          name: subResource.name,
          icon: subResource.icon,
          resourceId: subResource.resourceId!,
          path: subResource.path,
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

  async findByName(name: string): Promise<Subresource | null> {
    const subresource = await this.prisma.subresource.findFirst({ where: { name } });

    return subresource
      ? {
        id: subresource.id,
        name: subresource.name,
        icon: subresource.icon,
        path: subresource.path,
        resourceId: subresource.resourceId,
        createdAt: subresource.createdAt,
        updatedAt: subresource.updatedAt,
      }
      : null;
  }
}
