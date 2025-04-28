import { Module } from '@nestjs/common';
import { SupplierController } from './supplier.controller';
import { CreateSupplierUseCase } from '@domain/use-cases/supplier';
import { SupplierRepository } from '@domain/repositories/supplier';
import { SupplierRepositoryImpl } from '@infrastructure/repositories/supplier';
import { SupplierDataSourceService } from '@infrastructure/datasource/supplier';
import { FindAllSupplierUseCase } from '@domain/use-cases/supplier/find-all-supplier.use-case';
import { FindSupplierUseCase } from '@domain/use-cases/supplier/find-supplier.use-case';
import { UpdateSupplierUseCase } from '@domain/use-cases/supplier/update-supplier.use-case';
import { DeleteSupplierUseCase } from '@domain/use-cases/supplier/delete-supplier.use-case';
import { FindMiningTitlesUseCase } from '@domain/use-cases/supplier/find-mining-title.use-case';
import { PermissionsModule } from '@core/permissions/permissions.module';

@Module({
  imports: [PermissionsModule],
  controllers: [SupplierController],
  providers: [
    CreateSupplierUseCase,
    FindAllSupplierUseCase,
    FindSupplierUseCase,
    UpdateSupplierUseCase,
    DeleteSupplierUseCase,
    FindMiningTitlesUseCase,
    SupplierDataSourceService,
    {
      provide: SupplierRepository,
      useClass: SupplierRepositoryImpl,
    },
  ],
  exports: [SupplierRepository],
})
export class SupplierModule {}
