import { Module } from '@nestjs/common';
import { CommonController } from './common.controller';
import { GetCatalogsUseCase } from '@domain/use-cases/catalog';
import { PrismaService } from '@core/prisma/prisma.service';

@Module({
  controllers: [CommonController],
  providers: [GetCatalogsUseCase, PrismaService],
  exports: [],
})
export class CommonModule {}
