import { Module } from '@nestjs/common';
import {
  CreateResourceUseCase,
  CreateSubResourceUseCase,
  DeleteResourceUseCase,
  GetAllResourcesUseCase,
  GetByIdResourceUseCase,
  UpdateResourceUseCase,
} from 'src/core/domain/uses-cases';
import { ResourceController } from '../../controllers/resource/resource.controller';
import { SubResourceController } from '../../controllers/subresource/subresource.controller';
import { RepositoryModule } from '../repository.module';

@Module({
  imports: [RepositoryModule],
  controllers: [ResourceController, SubResourceController],
  providers: [
    CreateResourceUseCase,
    UpdateResourceUseCase,
    DeleteResourceUseCase,
    GetByIdResourceUseCase,
    GetAllResourcesUseCase,
    CreateSubResourceUseCase,
  ],
  exports: [
    CreateResourceUseCase,
    UpdateResourceUseCase,
    DeleteResourceUseCase,
    GetByIdResourceUseCase,
    GetAllResourcesUseCase,
    CreateSubResourceUseCase,
  ],
})
export class ResourceModule {} 