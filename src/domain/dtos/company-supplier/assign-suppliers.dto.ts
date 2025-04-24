import { IsArray, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignSuppliersDto {
  @ApiProperty({
    description: 'ID de la empresa',
    example: 'd11ac257-f467-4282-acd6-0b1d8acb1da4',
  })
  @IsUUID()
  companyId!: string;

  @ApiProperty({
    description: 'IDs de los proveedores',
    example: [
      '4db8775e-bc0f-4c12-8ce4-6e305d04e3dd',
      '6c02dca5-b684-4e7c-ab6b-e8552d47eeaf',
    ],
    type: [String],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  supplierIds: string[] = [];
}
