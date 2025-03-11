import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IResourceRepository } from '../../repositories/resource.repository';
import { Resource } from '@prisma/client';

@Injectable()
export class GetByIdResourceUseCase {
  constructor(
    @Inject('IResourceRepository') private readonly resourceRepository: IResourceRepository,
  ) {}

  async execute(id: string):Promise<Omit<Resource,|'createdAt'|'updatedAt'>> {
    const resource = await this.resourceRepository.findById(id);
    if (!resource) throw new NotFoundException(`Recurso con ID ${id} no encontrado`);

    return resource;
  }
}
