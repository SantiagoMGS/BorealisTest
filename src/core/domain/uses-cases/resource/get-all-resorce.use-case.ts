import { Inject, Injectable, Logger } from '@nestjs/common';
import { IResourceRepository } from '../../repositories/resource.repository';
import { Resource } from '@prisma/client';

@Injectable()
export class GetAllResourcesUseCase {
  private readonly logger = new Logger(GetAllResourcesUseCase.name);

  constructor(
    @Inject('IResourceRepository') private readonly resourceRepository: IResourceRepository,
  ) { }

  async execute(page: number, limit: number): Promise<{ resources: Omit<Resource, 'createdAt' | 'updatedAt'>[]; total: number }> {
    this.logger.log(`Getting all resource with page: ${page}, limit: ${limit}`);
    try {
      if (!(page ?? limit)) {
        throw new Error('Page and limit must be defined');
      }
      return this.resourceRepository.findAll(page, limit);
    } catch (error) {
      this.logger.error('Failed to get all resource', error.stack);
      throw error;
    }
  }
}
