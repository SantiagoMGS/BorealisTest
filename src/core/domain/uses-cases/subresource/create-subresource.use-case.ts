import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateSubResourceDto } from 'src/presentation/controllers/subresource/dtos/create-subresource.dto';
import { Subresource } from '../../entities';
import { ISubResourceRepository } from '../../repositories/subresource.reposiroty';

@Injectable()
export class CreateSubResourceUseCase {
  private readonly logger = new Logger(CreateSubResourceUseCase.name);

  constructor(
    @Inject('ISubResourceRepository')
    private readonly subResourceRepository: ISubResourceRepository,
  ) { }

  async execute(subResourceDto: CreateSubResourceDto): Promise<Subresource> {
    this.logger.log('Creating new subresource');

    try {
      const newSubResource: Subresource = {
        name: subResourceDto.name,
        icon: subResourceDto.icon,
        resourceId: subResourceDto.resourceId,
        path: subResourceDto.path,
      };

      const createdSubResource = await this.subResourceRepository.createSubResource(newSubResource);
      this.logger.log('Subresource created successfully');
      return createdSubResource;
    } catch (error) {
      this.logger.error('Failed to create subresource', (error as Error).stack);
      throw error;
    }
  }
}
