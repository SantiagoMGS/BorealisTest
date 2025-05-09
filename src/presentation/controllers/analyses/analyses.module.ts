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
import { CreateAnalysesUseCase } from '@domain/use-cases/analyses/create-analyses.usecase';
import { AnalysesRepository } from '@domain/repositories/analyses/analyses.repository';

@Module({
  imports: [PrismaModule],
  controllers: [AnalysesController],
  providers: [
    AnalysesDatasourceService,
    SampleReceptionDataSourceService,
    CompanyDataSourceService,
    ReceptionOriginDataSourceService,
    SupplierDataSourceService,
    ReceptionTypeDataSourceService,
    StatusDataSourceService,
    {
      provide: AnalysesRepository,
      useClass: AnalysesRepositoryImpl,
    },
    CreateAnalysesUseCase,
  ],
})
export class AnalysesModule {}
