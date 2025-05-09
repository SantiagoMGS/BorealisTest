import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para la respuesta de número de lote
 */
export class BatchNumberResponseDto {
  @ApiProperty({
    description: 'Siguiente número de lote para el proveedor',
    example: 'ABC-D-2023-001',
  })
  batchNumber!: string;
}
