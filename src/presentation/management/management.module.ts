import { Module } from '@nestjs/common';
import { DoreManagementController } from './dore-management.controller';
import { DoreReceptionRepositoryImpl } from '@infrastructure/repositories/reception/dore-reception.repository-impl.service';
import { DoreReceptionDataSourceService } from '@infrastructure/datasource/reception/dore-reception.datasource.service';
import { PrismaService } from '@core/prisma/prisma.service';
import {
  GetDoreDropdownDataUseCase,
  FindDoreReceptionsByFiltersUseCase,
} from '@domain/use-cases/reception';
import { CompanyDataSourceService } from '@infrastructure/datasource/company/company.datasource.service';
import { SupplierDataSourceService } from '@infrastructure/datasource/supplier/supplier.datasource.service';
import { ReceptionTypeDataSourceService } from '@infrastructure/datasource/reception/reception-type.datasource.service';
import { ReceptionOriginDataSourceService } from '@infrastructure/datasource/reception/reception-origin.datasource.service';
import { StatusDataSourceService } from '@infrastructure/datasource/status';
import { CityDataSourceService } from '@infrastructure/datasource/city/city.datasource.service';
import { PermissionsModule } from '@core/permissions/permissions.module';
import { DoreReceptionRepository } from '@domain/repositories/reception/dore-reception.repository';

@Module({
  imports: [PermissionsModule],
  controllers: [DoreManagementController],
  providers: [
    // Casos de uso
    GetDoreDropdownDataUseCase,
    FindDoreReceptionsByFiltersUseCase,

    // Repositorios
    {
      provide: DoreReceptionRepository,
      useClass: DoreReceptionRepositoryImpl,
    },

    // Datasources
    DoreReceptionDataSourceService,
    CompanyDataSourceService,
    SupplierDataSourceService,
    ReceptionTypeDataSourceService,
    ReceptionOriginDataSourceService,
    StatusDataSourceService,
    CityDataSourceService,

    // Core
    PrismaService,
  ],
})
export class ManagementModule {}
