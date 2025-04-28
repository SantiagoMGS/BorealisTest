import { Module } from '@nestjs/common';
import { CreateReceptionUseCase } from '@domain/use-cases/reception/create-reception.usecase';
import { GetReceptionUseCase } from '@domain/use-cases/reception/get-reception.usecase';
import { GetDefaultAnalysisUseCase } from '@domain/use-cases/reception/get-default-analysis.usecase';
//import { ListReceptionsUseCase } from '@domain/use-cases/reception/list-receptions.usecase';
import { ReceptionRepositoryImpl } from '@infrastructure/repositories/reception/reception.repository-impl.service';
import { ReceptionOriginRepositoryImpl } from '@infrastructure/repositories/reception/reception-origin.repository-impl';
import {
  ReceptionDataSourceService,
  ReceptionOriginDataSourceService,
} from '@infrastructure/datasource/reception';
import { PrismaModule } from '@core/prisma/prisma.module';
import { PermissionsModule } from '@core/permissions/permissions.module';
import { ReceptionSupplierRepositoryImpl } from '@infrastructure/repositories/reception/reception-supplier.repository';
import { ReceptionRepository } from '@domain/repositories/reception/reception.repository';
import { ReceptionOriginRepository } from '@domain/repositories/reception/reception-origin.repository';
import { CompanySupplierDataSourceService } from '@infrastructure/datasource/company-supplier';
import { SampleReceptionController } from './sample-reception.controller';
import { ReceptionOriginController } from './reception-origin.controller';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [PermissionsModule, PrismaModule, CompanyModule],
  controllers: [SampleReceptionController, ReceptionOriginController],
  providers: [
    // Casos de uso
    CreateReceptionUseCase,
    GetReceptionUseCase,
    GetDefaultAnalysisUseCase,
    //ListReceptionsUseCase,

    // Servicios de fuente de datos
    ReceptionDataSourceService,
    ReceptionOriginDataSourceService,
    CompanySupplierDataSourceService,

    // Implementaciones de repositorios
    ReceptionSupplierRepositoryImpl,
    ReceptionRepositoryImpl,
    ReceptionOriginRepositoryImpl,

    // Proveedores de repositorios
    {
      provide: ReceptionRepository,
      useClass: ReceptionRepositoryImpl,
    },
    {
      provide: ReceptionOriginRepository,
      useClass: ReceptionOriginRepositoryImpl,
    },
  ],
  exports: [ReceptionSupplierRepositoryImpl],
})
export class ReceptionModule {}
