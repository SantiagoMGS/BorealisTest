import { Module } from '@nestjs/common';
import { CommonController } from './common.controller';
import { GetCatalogsUseCase } from '@domain/use-cases/catalog';
import { CatalogRepositoryImpl } from '@infrastructure/repositories/catalog';
import { PrismaService } from '@core/prisma/prisma.service';
import { CatalogDatasource } from '@infrastructure/datasource/catalog';

@Module({
  controllers: [CommonController],
  providers: [
    GetCatalogsUseCase,
    CatalogDatasource,
    PrismaService,
    {
      provide: 'ICatalogReadRepository',
      useClass: CatalogRepositoryImpl,
    },
  ],
  exports: [],
})
export class CommonModule {}
