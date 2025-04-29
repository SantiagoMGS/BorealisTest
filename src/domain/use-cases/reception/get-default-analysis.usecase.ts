import { Injectable } from '@nestjs/common';
import { ReceptionOriginRepository } from '@domain/repositories/reception/reception-origin.repository';
import { DefaultAnalysisResponseDto } from '@presentation/controllers/reception/dtos';

@Injectable()
export class GetDefaultAnalysisUseCase {
  constructor(
    private readonly receptionOriginRepository: ReceptionOriginRepository,
  ) {}

  /**
   * Obtiene los análisis por defecto para un origen de recepción
   */
  async execute(originId: string): Promise<DefaultAnalysisResponseDto[]> {
    const analyses =
      await this.receptionOriginRepository.getDefaultAnalysisByOriginId(
        originId,
      );

    return analyses.map((analysis) => ({
      id: analysis.id,
      name: analysis.name,
      shortName: analysis.shortName,
      selected: true,
    }));
  }
}
