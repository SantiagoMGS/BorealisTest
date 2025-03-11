import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IResourceRepository } from '../../repositories/resource.repository';
import { Resource } from '@prisma/client';

@Injectable()
export class UpdateResourceUseCase {
  constructor(
    @Inject('IResourceRepository') private readonly resourceRepository: IResourceRepository,
  ) {}

  async execute(id: string, resourceData: Partial<Resource>): Promise<Omit<Resource,|'createdAt'|'updatedAt'>> {
    const existingResource = await this.resourceRepository.findById(id);
    if (!existingResource) throw new NotFoundException(`Recurso con ID ${id} no encontrado`);

    return this.resourceRepository.updateResource(id, resourceData);
  }
}
