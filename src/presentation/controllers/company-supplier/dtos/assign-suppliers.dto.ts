import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsUUID } from 'class-validator';

export class AssignSuppliersDto {
  @ApiProperty({
    description: 'ID de la compañía',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  companyId!: string;

  @ApiProperty({
    description: 'IDs de los proveedores a asignar a la compañía',
    example: [
      '123e4567-e89b-12d3-a456-426614174000',
      '123e4567-e89b-12d3-a456-426614174001',
    ],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  supplierIds!: string[];
}
