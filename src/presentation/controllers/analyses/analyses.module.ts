import { Module } from '@nestjs/common';
import { PrismaModule } from '@core/prisma/prisma.module';
import { AnalysesController } from './analyses.controller';
import { AnalysesDatasourceService } from '@infrastructure/datasource/analyses/analyses.datasource.service';
import { SampleReceptionDataSourceService } from '@infrastructure/datasource/reception/sample-reception.datasource.service';
import { CompanyDataSourceService } from '@infrastructure/datasource/company/company.datasource.service';
import { ReceptionOriginDataSourceService } from '@infrastructure/datasource/reception/reception-origin.datasource.service';
import { SupplierDataSourceService } from '@infrastructure/datasource/supplier/supplier.datasource.service';
import { ReceptionTypeDataSourceService } from '@infrastructure/datasource/reception/reception-type.datasource.service';
import { StatusDataSourceService } from '@infrastructure/datasource/status/status.datasource.service';
import { CreateDHAnalysesUseCase } from '@domain/use-cases/analyses/create-dh-analyses.usecase';
import { AnalysesRepository } from '@domain/repositories/analyses/analyses.repository';
import { AnalysisTypeDatasourceService } from '@infrastructure/datasource/analysis-type/analysis-type.datasorce.service';
import { CreateXRFAnalysesUseCase } from '@domain/use-cases/analyses/create-xrf-analyses.usecase';
import { PermissionsModule } from '@core/permissions/permissions.module';
import { createLWAnalysisUseCase } from '@domain/use-cases/analyses/create-lw-analyses-use-case';
import { CreateAAAnalysesUseCase } from '@domain/use-cases/analyses/create-aa-analyses.use-case';
import { GetActiveLWAnalysesUseCase } from '@domain/use-cases/analyses/get-active-lw-analyses.use-case';
import { AnalysesRepositoryImpl } from '@infrastructure/repositories/analyses/analyses.repository-imp.service';
import { FindAnalysisTypeByNameUseCase } from '@domain/use-cases/analysis-type/find-analysis-type-by-name.use-case';
import { AnalysisTypeRepository } from '@domain/repositories/analysis-type/analysis-type.respository';
import { AnalysisTypeRepositoryImpl } from '@infrastructure/repositories/analysis-type/analysis-type.repository-impl.service';
import { FindCompanyByIdUseCase } from '@domain/use-cases/company/find-company-by-id.use-case';
import { CompanyRepository } from '@domain/repositories/company/company.repository';
import { CompanyRepositoryImpl } from '@infrastructure/repositories/company-supplier/company.repository-impl.service';
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
    CreateAAAnalysesUseCase,
    GetActiveLWAnalysesUseCase,
    FindAnalysisTypeByNameUseCase,
    FindCompanyByIdUseCase,

    {
      provide: AnalysesRepository,
      useClass: AnalysesRepositoryImpl,
    },
    {
      provide: AnalysisTypeRepository,
      useClass: AnalysisTypeRepositoryImpl,
    },
    {
      provide: CompanyRepository,
      useClass: CompanyRepositoryImpl,
    },
  ],
})
export class AnalysesModule {}
