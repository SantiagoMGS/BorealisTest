import { Module } from '@nestjs/common';
import { CreateReceptionUseCase } from '@domain/use-cases/reception/create-reception.usecase';
import { GetReceptionUseCase } from '@domain/use-cases/reception/get-reception.usecase';
//import { ListReceptionsUseCase } from '@domain/use-cases/reception/list-receptions.usecase';
import { ReceptionRepositoryImpl } from '@infrastructure/repositories/reception/reception.repository-impl.service';
import { ReceptionDataSourceService } from '@infrastructure/datasource/reception/reception.datasource.service';
import { PrismaModule } from '@core/prisma/prisma.module';
import { PermissionsModule } from '@core/permissions/permissions.module';
import { ReceptionSupplierRepositoryImpl } from '@infrastructure/repositories/reception/reception-supplier.repository';
import { ReceptionRepository } from '@domain/repositories/reception/reception.repository';
import { CompanySupplierDataSourceService } from '@infrastructure/datasource/company-supplier';
import { SampleReceptionController } from './sample-reception.controller';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [PermissionsModule, PrismaModule, CompanyModule],
  controllers: [SampleReceptionController],
  providers: [
    CreateReceptionUseCase,
    GetReceptionUseCase,
    //ListReceptionsUseCase,
    ReceptionDataSourceService,
    CompanySupplierDataSourceService,
    ReceptionSupplierRepositoryImpl,
    ReceptionRepositoryImpl,
    {
      provide: ReceptionRepository,
      useClass: ReceptionRepositoryImpl,
    },
  ],
  exports: [ReceptionSupplierRepositoryImpl],
})
export class ReceptionModule {}
