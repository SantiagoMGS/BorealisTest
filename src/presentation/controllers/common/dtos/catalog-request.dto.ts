import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { CatalogTypeEnum } from '@domain/entities/catalog/catalog.entity';

export { CatalogTypeEnum as CatalogType };

export class CatalogParamDto {
  @ApiProperty({
    description: 'Tipo de catálogo a obtener',
    enum: CatalogTypeEnum,
    example: 'DOCUMENT_TYPES',
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(CatalogTypeEnum)
  type!: CatalogTypeEnum;
}
