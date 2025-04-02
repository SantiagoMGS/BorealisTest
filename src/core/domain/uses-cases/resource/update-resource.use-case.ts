import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IResourceRepository } from '../../repositories/resource.repository';
import { Resource } from '../../entities';

@Injectable()
export class UpdateResourceUseCase {
  private readonly logger = new Logger(UpdateResourceUseCase.name);

  constructor(
    @Inject('IResourceRepository') private readonly resourceRepository: IResourceRepository,
  ) { }

  async execute(id: string, resourceData: Partial<Resource>): Promise<Omit<Resource, | 'createdAt' | 'updatedAt'>> {
    this.logger.log(`Updating resource ID: ${id}`);
    try {
      const existingResource = await this.resourceRepository.findById(id);
      if (!existingResource) throw new NotFoundException(`Recurso con ID ${id} no encontrado`);
      return this.resourceRepository.updateResource(id, resourceData);
    } catch (error) {
      this.logger.error(`Failed to update user ID: ${id}`, (error as Error).stack);
      throw error;
    }
  }
}
