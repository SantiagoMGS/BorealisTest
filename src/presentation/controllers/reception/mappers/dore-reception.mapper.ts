import { IDoreReceptionEntity } from '@domain/entities/reception';
import { CreateDoreReceptionDto, DoreReceptionResponseDto } from '../dtos';

export class DoreReceptionMapper {
  /**
   * Convierte un DTO de creación a una entidad de dominio
   */
  static toEntity(
    createDto: CreateDoreReceptionDto,
    companyId: string,
  ): IDoreReceptionEntity {
    return {
      companyId,
      supplierId: createDto.supplierId,
      receptionTypeId: createDto.receptionTypeId,
      receptionOriginId: createDto.receptionOriginId,
      receptionDate: createDto.receptionDate || new Date(),
      batchNumber: createDto.batchNumber,
      observation: createDto.observation,
      items: createDto.items.map((item) => ({
        receivedWeight: item.receivedWeight,
        observation: item.observation,
      })),
    };
  }

  /**
   * Convierte una respuesta del dominio a un DTO de respuesta
   */
  static toResponseDto(reception: any): DoreReceptionResponseDto {
    const responseDto = new DoreReceptionResponseDto();
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

    if (reception.dores) {
      responseDto.dores = reception.dores;
    }

    return responseDto;
  }
}
