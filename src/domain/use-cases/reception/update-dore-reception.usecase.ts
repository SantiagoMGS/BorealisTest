import { Injectable } from '@nestjs/common';
import { DoreReceptionRepository } from '@domain/repositories/reception/dore-reception.repository';
import { IDoreReceptionResponse } from '@domain/interfaces/reception/dore-reception-response.interface';
import { DoreReceptionItemDto } from '@presentation/controllers/management/dtos/dore-reception-paginated-response.dto';
import { UpdateDoreReceptionDto } from '@presentation/controllers/management/dtos/update-dore-reception.dto';

@Injectable()
export class UpdateDoreReceptionUseCase {
  constructor(
    private readonly doreReceptionRepository: DoreReceptionRepository,
  ) {}

  async execute(
    updateData: UpdateDoreReceptionDto,
  ): Promise<DoreReceptionItemDto> {
    const response =
      await this.doreReceptionRepository.updateDoreReception(updateData);

    if (!response.supplier || !response.receptionOrigin) {
      throw new Error('Datos de recepción incompletos');
    }

    return {
      id: response.id,
      batchNumber: response.batchNumber || null,
      receptionDate: response.receptionDate,
      observation: response.observation || null,
      dore: response.dores.map((dore) => {
        if (!dore.id || !dore.code) {
          throw new Error('Datos de doré incompletos');
        }
        return {
          id: dore.id,
          code: dore.code,
          receivedWeight: dore.receivedWeight,
          base64: dore.base64 || null,
          format: dore.format,
        };
      }),
      supplier: {
        id: response.supplier.id,
        name: response.supplier.name,
      },
      receptionOrigin: {
        id: response.receptionOrigin.id,
        name: response.receptionOrigin.name,
      },
    };
  }
}
