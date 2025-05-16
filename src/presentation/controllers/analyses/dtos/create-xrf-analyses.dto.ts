import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsDateString } from 'class-validator';
import { MultipartFile } from '@fastify/multipart';

export class CreateXRFAnalysesDto {
  @ApiProperty({
    description: 'ID de la muestra',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  sampleId!: string;

  @ApiProperty({
    description: 'Fecha del análisis',
    example: '2024-03-20',
  })
  @IsDateString()
  @IsNotEmpty()
  analysisDate!: string;

  @ApiProperty({
    description: 'Archivo XRF',
    type: 'string',
    format: 'binary',
  })
  file!: MultipartFile;
}
