import { Module } from '@nestjs/common';
import { AssignSuppliersUseCase } from '@domain/use-cases/company-supplier/assign-suppliers.use-case';
import { CompanySupplierRepositoryImpl } from '@infrastructure/repositories/company-supplier/company-supplier.repository-impl.service';
import { CompanySupplierDataSourceService } from '@infrastructure/datasource/company-supplier';
import { PermissionsModule } from '@core/permissions/permissions.module';
import { PrismaModule } from '@core/prisma/prisma.module';
import { CompanyController } from './company.controller';
import { CompanyDataSourceService } from '@infrastructure/datasource/company/company.datasource.service';

@Module({
  imports: [PermissionsModule, PrismaModule],
  controllers: [CompanyController],
  providers: [
    AssignSuppliersUseCase,
    CompanySupplierDataSourceService,
    CompanySupplierRepositoryImpl,
    CompanyDataSourceService,
  ],
  exports: [CompanySupplierRepositoryImpl, CompanyDataSourceService],
})
export class CompanyModule {}
