import { ISupplierEntity } from '@domain/entities/supplier';
import { CreateSupplierDto, SupplierResponseDto } from '../dtos';

export class SupplierMapper {
  static toEntity(createDto: CreateSupplierDto): ISupplierEntity {
    return {
      name: createDto.name,
      documentTypeId: createDto.documentTypeId,
      documentNumber: createDto.documentNumber,
      verificationDigit: createDto.verificationDigit,
    };
  }

  static toResponseDto(supplier: any): SupplierResponseDto {
    const responseDto = new SupplierResponseDto();
    responseDto.id = supplier.id;
    responseDto.name = supplier.name;

    responseDto.documentType = {
      id: supplier.documentType.id,
      name: supplier.documentType.name,
      code: supplier.documentType.code,
    };

    responseDto.verificationDigit = supplier.verificationDigit;
    responseDto.documentNumber = supplier.documentNumber;
    responseDto.shortName = supplier.shortName;
    responseDto.isActive = supplier.isActive ?? true;

    return responseDto;
  }

  static toResponseDtoList(suppliers: any[]): SupplierResponseDto[] {
    return suppliers.map(this.toResponseDto);
  }
}
