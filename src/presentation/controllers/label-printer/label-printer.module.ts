import { Module } from '@nestjs/common';
import { LabelPrinterController } from './label-printer.controller';
import { LabelPrinterService } from '@infrastructure/integrations/label-printer.service';

@Module({
  controllers: [LabelPrinterController],
  providers: [LabelPrinterService],
  exports: [LabelPrinterService],
})
export class LabelPrinterModule {}
