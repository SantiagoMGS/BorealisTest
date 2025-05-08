import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateSampleDto {
  @ApiProperty({
    description: 'ID del proveedor',
    example: '12345678-1234-1234-1234-123456789012',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  supplierId?: string;

  @ApiProperty({
    description: 'IDs de los tipos de análisis a realizar',
    example: ['12345678-1234-1234-1234-123456789012'],
    required: false,
    type: [String],
  })
  @IsOptional()
  analysisTypeIds?: string[];

  @ApiProperty({
    description: 'Peso recibido de la muestra',
    example: 100.5,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  receivedWeight?: number;

  @ApiProperty({
    description: 'Observación adicional',
    example: 'Muestra con alto contenido de humedad',
    required: false,
  })
  @IsString()
  @IsOptional()
  observation?: string;
}
