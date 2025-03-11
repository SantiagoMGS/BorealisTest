import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IResourceRepository } from '../../repositories/resource.repository';

@Injectable()
export class DeleteResourceUseCase {
  constructor(
    @Inject('IResourceRepository') private readonly resourceRepository: IResourceRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const existingResource = await this.resourceRepository.findById(id);
    if (!existingResource) throw new NotFoundException(`Recurso con ID ${id} no encontrado`);

    await this.resourceRepository.deleteResource(id);
  }
}
