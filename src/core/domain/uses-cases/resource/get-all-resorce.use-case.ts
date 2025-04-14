import { Inject, Injectable, Logger } from '@nestjs/common';
import { Resource } from '../../entities';
import { IResourceRepository } from '../../repositories/resource.repository';

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
      const result = await this.resourceRepository.findAll(page, limit);
      return {
        resources: result.data.map(({ createdAt, updatedAt, ...rest }) => rest),
        total: result.total,
      };
    } catch (error) {
      this.logger.error('Failed to get all resource', (error as Error).stack);
      throw error;
    }
  }
}
