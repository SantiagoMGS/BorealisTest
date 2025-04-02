import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ISubResourceRepository } from 'src/core/domain/repositories/subresource.reposiroty';
import { Subresource } from 'src/core/domain/entities';

@Injectable()
export class PrismaSubResourceRepository implements ISubResourceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createSubResource(subResource: Subresource): Promise<Subresource> {
    try {
      const created = await this.prisma.subresource.create({
        data: {
          name: subResource.name,
          resourceId: subResource.resourceId,
        },
      });

      return new Subresource(created.id, created.name, created.resourceId);
    } catch (error) {
      throw new ConflictException(`El subrecurso "${subResource.name}" ya existe.`);
    }
  }

  async findByName(name: string): Promise<Subresource | null> {
    const subresource = await this.prisma.subresource.findFirst({ where: { name } });

    return subresource
      ? new Subresource(subresource.id, subresource.name, subresource.resourceId)
      : null;
  }
}
