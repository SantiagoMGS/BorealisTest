import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateSubResourceDto } from 'src/presentation/controllers/subresource/dtos/create-subresource.dto';
import { ISubResourceRepository } from '../../repositories/subresource.reposiroty';
import { SubResource } from '../../entities';

@Injectable()
export class CreateSubResourceUseCase {
  private readonly logger = new Logger(CreateSubResourceUseCase.name);

  constructor(@Inject('ISubResourceRepository') private readonly subResourceRepository: ISubResourceRepository) {}

  async execute(subResourceDto: CreateSubResourceDto): Promise<SubResource> {
    this.logger.log('Creating new resource');

    try {
      const newSubResource = new SubResource('', subResourceDto.name, subResourceDto.resourceId);
      const createdSubResource = await this.subResourceRepository.createSubResource(newSubResource);
      this.logger.log('Resource created successfully');
      return createdSubResource;
    } catch (error) {
      this.logger.error('Failed to create resource', error.stack);
      throw error;
    }
  }
}