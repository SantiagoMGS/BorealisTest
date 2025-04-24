import { Module } from '@nestjs/common';
import { CompanySupplierController } from './company-supplier.controller';
import { AssignSuppliersUseCase } from '@domain/use-cases/company-supplier/assign-suppliers.use-case';
import { CompanySupplierRepositoryImpl } from '@infrastructure/repositories/company-supplier/company-supplier.repository';
import { CompanySupplierDataSourceService } from '@infrastructure/datasource/company-supplier';
import { PermissionsModule } from '@core/permissions/permissions.module';
import { PrismaModule } from '@core/prisma/prisma.module';

@Module({
  imports: [PermissionsModule, PrismaModule],
  controllers: [CompanySupplierController],
  providers: [
    AssignSuppliersUseCase,
    CompanySupplierDataSourceService,
    CompanySupplierRepositoryImpl,
  ],
  exports: [CompanySupplierRepositoryImpl],
})
export class CompanySupplierModule {}
