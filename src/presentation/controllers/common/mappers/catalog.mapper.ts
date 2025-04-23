import {
  AnalysisTypeDto,
  DocumentTypeDto,
  ReceptionOriginDto,
  ReceptionTypeDto,
  SupplierDto,
} from '../dtos';

export class CatalogMapper {
  static documentTypeToDto(entity: any): DocumentTypeDto {
    return {
      id: entity.id,
      name: entity.name,
      code: entity.code,
    };
  }

  static supplierToDto(entity: any): SupplierDto {
    return {
      id: entity.id,
      name: entity.name,
      documentTypeId: entity.documentTypeId,
      documentNumber: entity.documentNumber,
    };
  }

  static receptionTypeToDto(entity: any): ReceptionTypeDto {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
    };
  }

  static receptionOriginToDto(entity: any): ReceptionOriginDto {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
    };
  }

  static analysisTypeToDto(entity: any): AnalysisTypeDto {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
    };
  }
}
