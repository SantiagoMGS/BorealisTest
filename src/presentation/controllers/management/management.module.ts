import { Module } from '@nestjs/common';
import { DoreManagementController } from './dore-management.controller';
import { DoreReceptionRepositoryImpl } from '@infrastructure/repositories/reception/dore-reception.repository-impl.service';
import { DoreReceptionDataSourceService } from '@infrastructure/datasource/reception/dore-reception.datasource.service';
import { PrismaService } from '@core/prisma/prisma.service';
import { FindDoreReceptionsByFiltersUseCase } from '@domain/use-cases/reception';
import { CompanyDataSourceService } from '@infrastructure/datasource/company/company.datasource.service';
import { SupplierDataSourceService } from '@infrastructure/datasource/supplier/supplier.datasource.service';
import { ReceptionTypeDataSourceService } from '@infrastructure/datasource/reception/reception-type.datasource.service';
import { ReceptionOriginDataSourceService } from '@infrastructure/datasource/reception/reception-origin.datasource.service';
import { StatusDataSourceService } from '@infrastructure/datasource/status';
import { CityDataSourceService } from '@infrastructure/datasource/city/city.datasource.service';
import { PermissionsModule } from '@core/permissions/permissions.module';
import { DoreReceptionRepository } from '@domain/repositories/reception/dore-reception.repository';
import { SampleManagementController } from './sample-management.controller';
import { GetDoreDropdownDataUseCase } from '@domain/use-cases/manegement';
import { GetSampleDropdownDataUseCase } from '@domain/use-cases/manegement/get-sample-dropdown-data.usecase';
import { SampleManagementRepository } from '@domain/repositories/management/sample-management.repository';
import { SampleManagementRepositoryImpl } from '@infrastructure/repositories/management/sample-management.repository-impl.service';
import { SampleManagementDataSourceService } from '@infrastructure/datasource/management/sample-management.datasource.service';
import { DoreManagementRepository } from '@domain/repositories/management/dore-management.repository';
import { DoreManagementRepositoryImpl } from '@infrastructure/repositories/management/dore-management.repository-impl.service';
import { DoreManagementDataSourceService } from '@infrastructure/datasource/management/dore-management.datasource.service';
@Module({
  imports: [PermissionsModule],
  controllers: [DoreManagementController, SampleManagementController],
  providers: [
    // Casos de uso
    GetDoreDropdownDataUseCase,
    FindDoreReceptionsByFiltersUseCase,
    GetSampleDropdownDataUseCase,
    // Repositorios
    {
      provide: DoreManagementRepository,
      useClass: DoreManagementRepositoryImpl,
    },
    {
      provide: DoreReceptionRepository,
      useClass: DoreReceptionRepositoryImpl,
    },
    {
      provide: SampleManagementRepository,
      useClass: SampleManagementRepositoryImpl,
    },
    {
      provide: DoreManagementDataSourceService,
      useClass: DoreManagementDataSourceService,
    },

    // Datasources
    DoreReceptionDataSourceService,
    SampleManagementDataSourceService,
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
