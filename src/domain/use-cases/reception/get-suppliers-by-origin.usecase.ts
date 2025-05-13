import { Injectable } from '@nestjs/common';
import { ReceptionOriginRepository } from '@domain/repositories/reception/reception-origin.repository';

@Injectable()
export class GetSuppliersByOriginUseCase {
  constructor(
    private readonly receptionOriginRepository: ReceptionOriginRepository,
  ) {}

  async execute(
    originId: string,
  ): Promise<Array<{ id: string; name: string }>> {
    return this.receptionOriginRepository.getSuppliersByOriginId(originId);
  }
}
