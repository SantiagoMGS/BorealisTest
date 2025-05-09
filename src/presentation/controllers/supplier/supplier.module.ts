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
import { ShortNameGeneratorService } from '@infrastructure/services/supplier/shortname-generator.service';
import { CompanyModule } from '../company/company.module';
import { ICompanySupplierRepository } from '@domain/repositories/company-supplier/company-supplier.repository';
import { CompanySupplierRepositoryImpl } from '@infrastructure/repositories/company-supplier/company-supplier.repository-impl.service';

@Module({
  imports: [PermissionsModule, CompanyModule],
  controllers: [SupplierController],
  providers: [
    CreateSupplierUseCase,
    FindAllSupplierUseCase,
    FindSupplierUseCase,
    UpdateSupplierUseCase,
    DeleteSupplierUseCase,
    FindMiningTitlesUseCase,
    SupplierDataSourceService,
    ShortNameGeneratorService,
    {
      provide: SupplierRepository,
      useClass: SupplierRepositoryImpl,
    },
    {
      provide: ICompanySupplierRepository,
      useExisting: CompanySupplierRepositoryImpl,
    },
  ],
  exports: [SupplierRepository, SupplierDataSourceService],
})
export class SupplierModule {}
