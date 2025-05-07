import { Module } from '@nestjs/common';
import { LabelPrinterController } from './label-printer.controller';
import { LabelPrinterService } from '@infrastructure/datasource/printer-label/label-printer.datasource.service';
import { LabelPrinterRepositoryImpl } from '@infrastructure/repositories/label-printer/label-printer.repository-impl.service';
import { PrintReceptionLabelUseCase } from '@domain/use-cases/label-printer/print-reception-label.use-case';
import { TestConnectionUseCase } from '@domain/use-cases/label-printer/test-connection.use-case';
import { PrismaService } from '@core/prisma/prisma.service';
import { PermissionsModule } from '@core/permissions/permissions.module';
import { PrismaModule } from '@core/prisma/prisma.module';

@Module({
  imports: [PermissionsModule, PrismaModule],
  controllers: [LabelPrinterController],
  providers: [
    // Datasource
    LabelPrinterService,
    PrismaService,

    // Repository
    LabelPrinterRepositoryImpl,

    // Use Cases
    PrintReceptionLabelUseCase,
    TestConnectionUseCase,
  ],
  exports: [LabelPrinterService],
})
export class LabelPrinterModule {}
