import { ISupplierEntity } from '@domain/entities/supplier';
import { ISupplierResponse } from '@domain/interfaces/supplier';
import { CreateSupplierDto, SupplierResponseDto } from '../dtos';

export class SupplierMapper {
  /**
   * Convierte un DTO de creación a una entidad de dominio
   */
  static toEntity(createDto: CreateSupplierDto): ISupplierEntity {
    return {
      name: createDto.name,
      documentTypeId: createDto.documentTypeId,
      documentNumber: createDto.documentNumber,
      verificationDigit: createDto.verificationDigit,
    };
  }

  /**
   * Convierte una respuesta del dominio a un DTO de respuesta
   */
  static toResponseDto(supplier: ISupplierResponse): SupplierResponseDto {
    const responseDto = new SupplierResponseDto();
    responseDto.id = supplier.id;
    responseDto.name = supplier.name;
    responseDto.documentTypeId = supplier.documentTypeId;
    responseDto.verificationDigit = supplier.verificationDigit;

    // Agregar información del documentType si está disponible
    if (supplier.documentType) {
      responseDto.documentType = {
        id: supplier.documentType.id,
        name: supplier.documentType.name,
        code: supplier.documentType.code,
      };
    }

    responseDto.documentNumber = supplier.documentNumber;
    responseDto.isActive = supplier.isActive ?? true;

    return responseDto;
  }
}
