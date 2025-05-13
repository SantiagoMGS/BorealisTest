import { IReceptionEntity } from '@domain/entities/reception';
import { IReceptionResponse } from '@domain/interfaces/reception';
import { CreateReceptionDto, ReceptionResponseDto } from '../dtos';

export class ReceptionMapper {
  /**
   * Convierte un DTO de creación a una entidad de dominio
   */
  static toEntity(
    createDto: CreateReceptionDto,
    companyId: string,
  ): IReceptionEntity {
    return {
      companyId,
      supplierId: createDto.supplierId,
      receptionDate: createDto.receptionDate,
      batchNumber: createDto.batchNumber,
      observation: createDto.observation,

      samples: createDto.items.map((item) => ({
        receptionOriginId: item.receptionOriginId,
        receivedWeight: item.receivedWeight,
        analysisTypeIds: item.analysisTypeIds,
      })),
    };
  }

  static toResponseDto(reception: IReceptionResponse): ReceptionResponseDto {
    const responseDto = new ReceptionResponseDto();
    responseDto.id = reception.id;
    responseDto.receptionDate = reception.receptionDate;
    responseDto.batchNumber = reception.batchNumber;
    responseDto.observation = reception.observation;
    responseDto.isActive = reception.isActive;
    responseDto.createdAt = reception.createdAt;
    responseDto.updatedAt = reception.updatedAt;

    if (reception.company) {
      responseDto.company = reception.company;
    }

    if (reception.supplier) {
      responseDto.supplier = reception.supplier;
    }

    if (reception.receptionType) {
      responseDto.receptionType = reception.receptionType;
    }

    if (reception.receptionOrigin) {
      responseDto.receptionOrigin = reception.receptionOrigin;
    }

    if (reception.miningTitle) {
      responseDto.miningTitle = reception.miningTitle;
    }

    if (reception.city) {
      responseDto.city = reception.city;
    }

    if (reception.samples) {
      responseDto.samples = reception.samples;
    }

    return responseDto;
  }
}
