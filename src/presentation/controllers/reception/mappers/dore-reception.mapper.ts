import { IDoreReceptionEntity } from '@domain/entities/reception';
import { CreateDoreReceptionDto, DoreReceptionResponseDto } from '../dtos';

export class DoreReceptionMapper {
  static toEntity(
    createDto: CreateDoreReceptionDto,
    companyId: string,
  ): IDoreReceptionEntity {
    return {
      companyId,
      supplierId: createDto.supplierId,
      receptionOriginId: createDto.receptionOriginId,
      miningTitleId: createDto.miningTitleId,
      cityId: createDto.cityId,
      receptionDate: createDto.receptionDate || new Date(),
      batchNumber: createDto.batchNumber,
      observation: createDto.observation,

      items: createDto.items.map((item) => ({
        receivedWeight: item.receivedWeight,
        observation: item.observation,
        images: [
          {
            format: item.image.format,
            base64: item.image.base64,
          },
        ],
      })),
    };
  }

  static toResponseDto(reception: any): DoreReceptionResponseDto {
    const responseDto = new DoreReceptionResponseDto();
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

    if (reception.dores) {
      responseDto.dores = reception.dores;
    }

    return responseDto;
  }
}
