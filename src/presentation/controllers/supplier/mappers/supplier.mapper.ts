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
      documentType: createDto.documentType,
      documentNumber: createDto.documentNumber,
    };
  }

  /**
   * Convierte una respuesta del dominio a un DTO de respuesta
   */
  static toResponseDto(supplier: ISupplierResponse): SupplierResponseDto {
    const responseDto = new SupplierResponseDto();
    responseDto.id = supplier.id;
    responseDto.name = supplier.name;
    responseDto.documentType = supplier.documentType;
    responseDto.documentNumber = supplier.documentNumber;
    responseDto.isActive = supplier.isActive;
    responseDto.createdAt = supplier.createdAt;
    responseDto.updatedAt = supplier.updatedAt;

    return responseDto;
  }
}
