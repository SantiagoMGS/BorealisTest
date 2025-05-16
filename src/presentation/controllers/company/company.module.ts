import { forwardRef, Module } from '@nestjs/common';
import { PermissionsModule } from '@core/permissions/permissions.module';
import { PrismaModule } from '@core/prisma/prisma.module';
import { CompanyController } from './company.controller';
import { CompanyDataSourceService } from '@infrastructure/datasource/company/company.datasource.service';
import { CompanyRepositoryImpl } from '@infrastructure/repositories/company/company.repository-impl.service';
import { AssignCompanySupplierUseCase } from '@domain/use-cases/company/assign-company-supplier.use-case';
import { CompanyRepository } from '@domain/repositories/company/company.repository';
import { SupplierRepository } from '@domain/repositories/supplier';
import { SupplierRepositoryImpl } from '@infrastructure/repositories/supplier';
import { SupplierDataSourceService } from '@infrastructure/datasource/supplier';
import { SupplierModule } from '../supplier/supplier.module';

@Module({
  imports: [PermissionsModule, PrismaModule, forwardRef(() => SupplierModule)],
  controllers: [CompanyController],
  providers: [
    AssignCompanySupplierUseCase,
    CompanyDataSourceService,
    CompanyRepositoryImpl,
    {
      provide: CompanyRepository,
      useClass: CompanyRepositoryImpl,
    },
    {
      provide: SupplierRepository,
      useClass: SupplierRepositoryImpl,
    },
  ],
  exports: [CompanyRepositoryImpl, CompanyDataSourceService],
})
export class CompanyModule {}
