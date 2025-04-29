import { Injectable } from '@nestjs/common';
import { ReceptionOriginRepository } from '@domain/repositories/reception/reception-origin.repository';

@Injectable()
export class GetSuppliersByOriginUseCase {
  constructor(
    private readonly receptionOriginRepository: ReceptionOriginRepository,
  ) {}

  /**
   * Obtiene la lista de proveedores asociados a un origen de recepción específico
   * @param originId ID del origen de recepción
   * @returns Lista de proveedores con id y nombre
   */
  async execute(
    originId: string,
  ): Promise<Array<{ id: string; name: string }>> {
    return this.receptionOriginRepository.getSuppliersByOriginId(originId);
  }
}
