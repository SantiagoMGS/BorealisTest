import { Module } from '@nestjs/common';
import { LabelPrinterController } from './label-printer.controller';
import { LabelPrinterService } from '@infrastructure/datasource/printer-label/label-printer.datasource.service';
import { LabelPrinterRepositoryImpl } from '@infrastructure/repositories/label-printer/label-printer.repository-impl.service';
import { PrintReceptionLabelUseCase } from '@domain/use-cases/label-printer/print-reception-label.use-case';
import { TestConnectionUseCase } from '@domain/use-cases/label-printer/test-connection.use-case';
import { GetPrintersUseCase } from '@domain/use-cases/label-printer/get-printers.use-case';
import { PermissionsModule } from '@core/permissions/permissions.module';
import { PrismaModule } from '@core/prisma/prisma.module';
import { CompanyRepositoryImpl } from '@infrastructure/repositories/company-supplier/company.repository-impl.service';
import { SampleReceptionRepositoryImpl } from '@infrastructure/repositories/reception/sample-reception.repository-impl.service';
import { CompanyDataSourceService } from '@infrastructure/datasource/company/company.datasource.service';
import { SampleReceptionDataSourceService } from '@infrastructure/datasource/reception/sample-reception.datasource.service';
import { SupplierDataSourceService } from '@infrastructure/datasource/supplier/supplier.datasource.service';
import { ReceptionTypeDataSourceService } from '@infrastructure/datasource/reception/reception-type.datasource.service';
import { ReceptionOriginDataSourceService } from '@infrastructure/datasource/reception/reception-origin.datasource.service';
import { StatusDataSourceService } from '@infrastructure/datasource/status';

@Module({
  imports: [PermissionsModule, PrismaModule],
  controllers: [LabelPrinterController],
  providers: [
    // Datasource
    LabelPrinterService,
    CompanyDataSourceService,
    SampleReceptionDataSourceService,
    SupplierDataSourceService,
    ReceptionTypeDataSourceService,
    ReceptionOriginDataSourceService,
    StatusDataSourceService,

    // Repository
    LabelPrinterRepositoryImpl,
    CompanyRepositoryImpl,
    SampleReceptionRepositoryImpl,

    // Use Cases
    PrintReceptionLabelUseCase,
    TestConnectionUseCase,
    GetPrintersUseCase,
  ],
  exports: [LabelPrinterService],
})
export class LabelPrinterModule {}
