import { Module } from '@nestjs/common';
import { CreateReceptionUseCase } from '@domain/use-cases/reception/create-sample-reception.usecase';
import { GetReceptionUseCase } from '@domain/use-cases/reception/get-sample-reception.usecase';
import { UpdateSampleReceptionUseCase } from '@domain/use-cases/reception/update-sample-reception.usecase';
import { DeleteSampleReceptionUseCase } from '@domain/use-cases/reception/delete-sample-reception.usecase';
import { GetDefaultAnalysisUseCase } from '@domain/use-cases/reception/get-default-analysis.usecase';
import { GetSuppliersByOriginUseCase } from '@domain/use-cases/reception/get-suppliers-by-origin.usecase';
import { GetNextBatchNumberUseCase } from '@domain/use-cases/reception/get-next-batch-number.usecase';
import { SampleReceptionRepositoryImpl } from '@infrastructure/repositories/reception/sample-reception.repository-impl.service';
import { ReceptionOriginRepositoryImpl } from '@infrastructure/repositories/reception/reception-origin.repository-impl.service';
import {
  SampleReceptionDataSourceService,
  ReceptionOriginDataSourceService,
  ReceptionTypeDataSourceService,
} from '@infrastructure/datasource/reception';
import { StatusDataSourceService } from '@infrastructure/datasource/status';
import { PrismaModule } from '@core/prisma/prisma.module';
import { PermissionsModule } from '@core/permissions/permissions.module';
import { SampleReceptionRepository } from '@domain/repositories/reception/sample-reception.repository';
import { ReceptionOriginRepository } from '@domain/repositories/reception/reception-origin.repository';
import { SampleReceptionController } from './sample-reception.controller';
import { ReceptionOriginController } from './reception-origin.controller';
import { CompanyModule } from '../company/company.module';
import { SupplierModule } from '../supplier/supplier.module';
import { DoreReceptionController } from './dore-reception.controller';
import { CreateDoreReceptionUseCase } from '@domain/use-cases/reception/create-dore-reception.usecase';
import { DoreReceptionRepositoryImpl } from '@infrastructure/repositories/reception/dore-reception.repository-impl.service';
import { DoreReceptionDataSourceService } from '@infrastructure/datasource/reception/dore-reception.datasource.service';
import { DoreReceptionRepository } from '@domain/repositories/reception/dore-reception.repository';
import { CityDataSourceService } from '@infrastructure/datasource/city';
import { CompanyDataSourceService } from '@infrastructure/datasource/company';
import { FindSupplierByIdUseCase } from '@domain/use-cases/supplier/find-supplier-by-id.use-case';
import { FindReceptionOriginByIdUseCase } from '@domain/use-cases/reception-origin/find-recepion-origin-by-id.use-case';
import { GenerateSampleCodeUseCase } from '@domain/use-cases/reception/generate-sample-code.use-case';

@Module({
  imports: [PermissionsModule, PrismaModule, CompanyModule, SupplierModule],
  controllers: [
    SampleReceptionController,
    ReceptionOriginController,
    DoreReceptionController,
  ],
  providers: [
    // Casos de uso
    CreateReceptionUseCase,
    GetReceptionUseCase,
    UpdateSampleReceptionUseCase,
    DeleteSampleReceptionUseCase,
    GetDefaultAnalysisUseCase,
    GetSuppliersByOriginUseCase,
    FindSupplierByIdUseCase,
    FindReceptionOriginByIdUseCase,
    GenerateSampleCodeUseCase,

    // Servicios de fuente de datos
    SampleReceptionDataSourceService,
    ReceptionOriginDataSourceService,
    ReceptionTypeDataSourceService,
    StatusDataSourceService,
    CompanyDataSourceService,
    CityDataSourceService,

    SampleReceptionRepositoryImpl,
    ReceptionOriginRepositoryImpl,

    // Proveedores de repositorios
    {
      provide: SampleReceptionRepository,
      useClass: SampleReceptionRepositoryImpl,
    },
    {
      provide: ReceptionOriginRepository,
      useClass: ReceptionOriginRepositoryImpl,
    },

    // Dore reception
    CreateDoreReceptionUseCase,
    GetNextBatchNumberUseCase,
    DoreReceptionDataSourceService,
    DoreReceptionRepositoryImpl,
    {
      provide: DoreReceptionRepository,
      useClass: DoreReceptionRepositoryImpl,
    },
  ],
  exports: [],
})
export class ReceptionModule {}
