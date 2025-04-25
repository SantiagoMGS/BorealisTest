import { IReceptionEntity } from '@domain/entities/reception';
import { IReceptionResponse } from '@domain/interfaces/reception';
import { CreateReceptionDto, ReceptionResponseDto } from '../dtos';

export class ReceptionMapper {
  /**
   * Convierte un DTO de creación a una entidad de dominio
   */
  static toEntity(createDto: CreateReceptionDto): IReceptionEntity {
    return {
      companyId: createDto.companyId,
      supplierId: createDto.supplierId,
      receptionTypeId: createDto.receptionTypeId,
      receptionOriginId: createDto.receptionOriginId,
      receptionDate: createDto.receptionDate,
      batchNumber: createDto.batchNumber,
      observation: createDto.observation,
    };
  }

  /**
   * Convierte una respuesta del dominio a un DTO de respuesta
   */
  static toResponseDto(reception: IReceptionResponse): ReceptionResponseDto {
    const responseDto = new ReceptionResponseDto();
    responseDto.id = reception.id;
    responseDto.receptionDate = reception.receptionDate;
    responseDto.batchNumber = reception.batchNumber;
    responseDto.observation = reception.observation;
    responseDto.isActive = reception.isActive;
    responseDto.createdAt = reception.createdAt;
    responseDto.updatedAt = reception.updatedAt;

    // Mapeo de relaciones si existen
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

    return responseDto;
  }
}
