import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IResourceRepository } from '../../repositories/resource.repository';
import { Resource } from '@prisma/client';

@Injectable()
export class GetByIdResourceUseCase {
  private readonly logger = new Logger(GetByIdResourceUseCase.name);

  constructor(
    @Inject('IResourceRepository') private readonly resourceRepository: IResourceRepository,
  ) { }

  async execute(id: string): Promise<Omit<Resource, | 'createdAt' | 'updatedAt'>> {
    this.logger.log(`Getting resource by ID: ${id}`);
    try {
      const resource = await this.resourceRepository.findById(id);
      if (!resource) throw new NotFoundException(`Recurso con ID ${id} no encontrado`);
      return resource;
    } catch (error) {
      this.logger.error(`Failed to get resource by ID: ${id}`, error.stack);
      throw error;
    }
  }
}
