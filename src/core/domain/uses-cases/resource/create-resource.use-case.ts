import { Inject, Injectable } from '@nestjs/common';
import { IResourceRepository } from '../../repositories/resource.repository';
import { Resource } from '../../entities/resource.entity';
import { CreateResourceDto } from 'src/presentation/controllers/dtos/create-resource.dto';

@Injectable()
export class CreateResourceUseCase {
  constructor(@Inject('IResourceRepository') private readonly ResourceRepository: IResourceRepository) { }


  async execute(resourceDto: CreateResourceDto): Promise<Resource> {
    const newResource = new Resource(
      '', resourceDto.name
    );
    return await this.ResourceRepository.createResource(newResource);
  }
}