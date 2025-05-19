import { forwardRef, Module } from '@nestjs/common';
import { SupplierController } from './supplier.controller';
import { CreateSupplierUseCase } from '@domain/use-cases/supplier';
import { SupplierRepository } from '@domain/repositories/supplier';
import { SupplierRepositoryImpl } from '@infrastructure/repositories/supplier';
import { SupplierDataSourceService } from '@infrastructure/datasource/supplier';
import { FindAllSupplierUseCase } from '@domain/use-cases/supplier/find-all-supplier.use-case';
import { FindSupplierUseCase } from '@domain/use-cases/supplier/find-supplier.use-case';
import { UpdateSupplierUseCase } from '@domain/use-cases/supplier/update-supplier.use-case';
import { DeleteSupplierUseCase } from '@domain/use-cases/supplier/delete-supplier.use-case';
import { PermissionsModule } from '@core/permissions/permissions.module';
import { ShortNameGeneratorService } from '@infrastructure/services/supplier/shortname-generator.service';
import { CompanyModule } from '../company/company.module';
import { GetMiningTitlesBySupplierUseCase } from '@domain/use-cases/mining-title/get-mining-titles-by-supplier.use-case';
import { CompanyRepository } from '@domain/repositories/company/company.repository';
import { CompanyRepositoryImpl } from '@infrastructure/repositories/company/company.repository-impl.service';
@Module({
  imports: [PermissionsModule, forwardRef(() => CompanyModule)],
  controllers: [SupplierController],
  providers: [
    CreateSupplierUseCase,
    FindAllSupplierUseCase,
    FindSupplierUseCase,
    UpdateSupplierUseCase,
    DeleteSupplierUseCase,
    GetMiningTitlesBySupplierUseCase,
    SupplierDataSourceService,
    ShortNameGeneratorService,
    {
      provide: SupplierRepository,
      useClass: SupplierRepositoryImpl,
    },
    {
      provide: CompanyRepository,
      useExisting: CompanyRepositoryImpl,
    },
  ],
  exports: [SupplierRepository, SupplierDataSourceService],
})
export class SupplierModule {}
