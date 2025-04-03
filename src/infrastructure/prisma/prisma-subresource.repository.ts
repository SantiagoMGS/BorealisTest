import { ConflictException, Injectable } from '@nestjs/common';
import { Subresource } from 'src/core/domain/entities';
import { ISubResourceRepository } from 'src/core/domain/repositories/subresource.reposiroty';
import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaSubResourceRepository implements ISubResourceRepository {
  constructor(private readonly prisma: PrismaService) { }

  async createSubResource(subResource: Subresource): Promise<Subresource> {
    try {
      console.log('subResource', subResource);

      const created = await this.prisma.subresource.create({
        data: {
          name: subResource.name,
          resourceId: subResource.resourceId!,
          icon: subResource.icon,
        },
      });

      return new Subresource(created.id, created.name, created.resourceId, created.icon);
    } catch (error) {
      throw new ConflictException(`El subrecurso "${subResource.name}" ya existe.`);
    }
  }

  async findByName(name: string): Promise<Subresource | null> {
    const subresource = await this.prisma.subresource.findFirst({ where: { name } });

    return subresource
      ? new Subresource(subresource.id, subresource.name, subresource.resourceId, subresource.icon)
      : null;
  }
}
