import {
  AnalysisTypeDto,
  DocumentTypeDto,
  ReceptionOriginDto,
  ReceptionTypeDto,
  SupplierDto,
} from '../dtos';
import {
  DocumentTypeEntity,
  SupplierEntity,
  ReceptionTypeEntity,
  ReceptionOriginEntity,
  AnalysisTypeEntity,
  CatalogTypeEnum,
} from '@domain/entities/catalog/catalog.entity';

export class CatalogMapper {
  /**
   * Factory que devuelve el mapper adecuado según el tipo de catálogo
   */
  static getMapper(type: CatalogTypeEnum): any {
    const mappers = {
      [CatalogTypeEnum.DOCUMENT_TYPES]: this.documentTypeToDto,
      [CatalogTypeEnum.SUPPLIERS]: this.supplierToDto,
      [CatalogTypeEnum.RECEPTION_TYPES]: this.receptionTypeToDto,
      [CatalogTypeEnum.RECEPTION_ORIGINS]: this.receptionOriginToDto,
      [CatalogTypeEnum.ANALYSIS_TYPES]: this.analysisTypeToDto,
    };

    return mappers[type] || ((item: any) => item);
  }

  static documentTypeToDto(entity: DocumentTypeEntity): DocumentTypeDto {
    return {
      id: entity.id,
      name: entity.name,
      code: entity.code,
    };
  }

  static supplierToDto(entity: SupplierEntity): SupplierDto {
    return {
      id: entity.id,
      name: entity.name,
      documentTypeId: entity.documentTypeId,
      documentNumber: entity.documentNumber,
    };
  }

  static receptionTypeToDto(entity: ReceptionTypeEntity): ReceptionTypeDto {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
    };
  }

  static receptionOriginToDto(
    entity: ReceptionOriginEntity,
  ): ReceptionOriginDto {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
    };
  }

  static analysisTypeToDto(entity: AnalysisTypeEntity): AnalysisTypeDto {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
    };
  }
}
