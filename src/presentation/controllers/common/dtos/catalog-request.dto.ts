import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum CatalogType {
  DOCUMENT_TYPES = 'DOCUMENT_TYPES',
  SUPPLIERS = 'SUPPLIERS',
  RECEPTION_TYPES = 'RECEPTION_TYPES',
  RECEPTION_ORIGINS = 'RECEPTION_ORIGINS',
  ANALYSIS_TYPES = 'ANALYSIS_TYPES',
}

export class CatalogParamDto {
  @ApiProperty({
    description: 'Tipo de catálogo a obtener',
    enum: CatalogType,
    example: 'DOCUMENT_TYPES',
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(CatalogType)
  type!: CatalogType;
}
