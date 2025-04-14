import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IResourceRepository } from '../../repositories/resource.repository';

@Injectable()
export class DeleteResourceUseCase {
  private readonly logger = new Logger(DeleteResourceUseCase.name);

  constructor(
    @Inject('IResourceRepository') private readonly resourceRepository: IResourceRepository,
  ) { }

  async execute(id: string): Promise<void> {
    try {
      const existingResource = await this.resourceRepository.findById(id);
      if (!existingResource) throw new NotFoundException(`Recurso con ID ${id} no encontrado`);

      await this.resourceRepository.delete(id);
    } catch (error) {
      this.logger.error(`Failed to delete resource ID: ${id}`, (error as Error).stack);
      throw error;
    }
  }
}