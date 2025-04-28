import { Injectable } from '@nestjs/common';
import { ReceptionOriginRepository } from '@domain/repositories/reception/reception-origin.repository';

@Injectable()
export class GetDefaultAnalysisUseCase {
  constructor(
    private readonly receptionOriginRepository: ReceptionOriginRepository,
  ) {}

  /**
   * Obtiene los análisis por defecto para un origen de recepción
   */
  async execute(originId: string) {
    return this.receptionOriginRepository.getDefaultAnalysisByOriginId(
      originId,
    );
  }
}
