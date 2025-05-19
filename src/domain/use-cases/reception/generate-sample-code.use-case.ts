import { Injectable } from '@nestjs/common';
import { SampleReceptionRepository } from '@domain/repositories/reception/sample-reception.repository';
import { IReceptionEntity, ISampleEntity } from '@domain/entities';
import { IReceptionResponse } from '@domain/interfaces/reception';
import { FindSupplierByIdUseCase } from '../supplier/find-supplier-by-id.use-case';
import { FindReceptionOriginByIdUseCase } from '../reception-origin/find-recepion-origin-by-id.use-case';

@Injectable()
export class GenerateSampleCodeUseCase {
  constructor(
    private readonly findSupplierByIdUseCase: FindSupplierByIdUseCase,
    private readonly findReceptionOriginByIdUseCase: FindReceptionOriginByIdUseCase,
  ) {}

  async execute(sample: ISampleEntity, supplierId: string): Promise<string> {
    const supplier = await this.findSupplierByIdUseCase.execute(supplierId);

    const origin = await this.findReceptionOriginByIdUseCase.execute(sample.receptionOriginId);

    const date = new Date();
    const dateString = date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '');

    return `${supplier.shortName}-${origin.shortName}-${dateString}`
  }
}
