import { Module } from '@nestjs/common';
import { SupplierController } from './supplier.controller';
import { CreateSupplierUseCase } from '@domain/use-cases/supplier';
import { SupplierRepository } from '@domain/repositories/supplier';
import { SupplierRepositoryImpl } from '@infrastructure/repositories/supplier';
import { SupplierDataSourceService } from '@infrastructure/datasource/supplier';

@Module({
  controllers: [SupplierController],
  providers: [
    CreateSupplierUseCase,
    SupplierDataSourceService,
    {
      provide: SupplierRepository,
      useClass: SupplierRepositoryImpl,
    },
  ],
  exports: [SupplierRepository],
})
export class SupplierModule {}
