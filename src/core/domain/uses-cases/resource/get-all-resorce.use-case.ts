import { Inject, Injectable } from '@nestjs/common';
import { IResourceRepository } from '../../repositories/resource.repository';
import { Resource } from '@prisma/client';

@Injectable()
export class GetAllResourcesUseCase {
  constructor(
    @Inject('IResourceRepository') private readonly resourceRepository: IResourceRepository,
  ) { }

  async execute(page: number, limit: number): Promise<{ resources: Omit<Resource, 'createdAt' | 'updatedAt'>[]; total: number }> {
    if (!(page ?? limit)) {
      throw new Error('Page and limit must be defined');
    }
    return this.resourceRepository.findAll(page, limit);
  }
}
