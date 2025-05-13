import { Module } from '@nestjs/common';
import { PrismaModule } from '@core/prisma/prisma.module';
import { AnalysesController } from './analyses.controller';
import { AnalysesDatasourceService } from '@infrastructure/datasource/analyses/analyses.datasorces.service';
import { SampleReceptionDataSourceService } from '@infrastructure/datasource/reception/sample-reception.datasource.service';
import { CompanyDataSourceService } from '@infrastructure/datasource/company/company.datasource.service';
import { ReceptionOriginDataSourceService } from '@infrastructure/datasource/reception/reception-origin.datasource.service';
import { SupplierDataSourceService } from '@infrastructure/datasource/supplier/supplier.datasource.service';
import { ReceptionTypeDataSourceService } from '@infrastructure/datasource/reception/reception-type.datasource.service';
import { StatusDataSourceService } from '@infrastructure/datasource/status/status.datasource.service';
import { AnalysesRepositoryImpl } from '@infrastructure/repositories/analyses/analyses.repository-imp.services';
import { CreateDHAnalysesUseCase } from '@domain/use-cases/analyses/create-dh-analyses.usecase';
import { AnalysesRepository } from '@domain/repositories/analyses/analyses.repository';
import { AnalysisTypeDatasourceService } from '@infrastructure/datasource/analysis-type/analysis-type.datasorce.service';
import { CreateXRFAnalysesUseCase } from '@domain/use-cases/analyses/create-xrf-analyses.usecase';
import { PermissionsModule } from '@core/permissions/permissions.module';
import { createLWAnalysisUseCase } from '@domain/use-cases/analyses/create-lw-analyses-use-case';

@Module({
  imports: [PrismaModule, PermissionsModule],
  controllers: [AnalysesController],
  providers: [
    AnalysesDatasourceService,
    SampleReceptionDataSourceService,
    CompanyDataSourceService,
    ReceptionOriginDataSourceService,
    SupplierDataSourceService,
    ReceptionTypeDataSourceService,
    StatusDataSourceService,
    AnalysisTypeDatasourceService,
    CreateXRFAnalysesUseCase,
    CreateDHAnalysesUseCase,
    createLWAnalysisUseCase,

    {
      provide: AnalysesRepository,
      useClass: AnalysesRepositoryImpl,
    },
  ],
})
export class AnalysesModule {}
