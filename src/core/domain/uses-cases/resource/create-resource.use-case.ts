import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateResourceDto } from 'src/presentation/controllers/resource/dtos/create-resource.dto';
import { Resource } from '../../entities';
import { IResourceRepository } from '../../repositories/resource.repository';

@Injectable()
export class CreateResourceUseCase {
  private readonly logger = new Logger(CreateResourceUseCase.name);

  constructor(@Inject('IResourceRepository') private readonly ResourceRepository: IResourceRepository) { }

  async execute(resourceDto: CreateResourceDto): Promise<Resource> {
    this.logger.log('Creating new resource');

    try {
      const newResource: Resource = {
        id: '', // o undefined si Prisma lo genera
        name: resourceDto.name,
        icon: resourceDto.icon,
        path: resourceDto.path,
      };
      const createdResource = await this.ResourceRepository.createResource(newResource);
      this.logger.log('Resource created successfully');
      return createdResource;
    } catch (error) {
      this.logger.error('Failed to create resource', (error as Error).stack);
      throw error;
    }
  }
}