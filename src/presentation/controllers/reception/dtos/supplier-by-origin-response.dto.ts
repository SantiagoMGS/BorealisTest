import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para la respuesta de proveedores por origen
 */
export class SupplierByOriginResponseDto {
  @ApiProperty({
    description: 'ID del proveedor',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  id!: string;

  @ApiProperty({
    description: 'Nombre del proveedor',
    example: 'Mineros Unidos S.A.S',
  })
  name!: string;
}
