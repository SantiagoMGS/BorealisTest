import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateDoreReceptionDto {
  @ApiProperty({
    description: 'ID de la recepción',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @IsUUID()
  id!: string;

  @ApiProperty({
    description: 'Peso recibido',
    example: 1000.5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  receivedWeight?: number;

  @ApiProperty({
    description: 'Peso final',
    example: 950.5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  finalWeight?: number;

  @ApiProperty({
    description: 'Observaciones',
    example: 'Doré en buenas condiciones',
    required: false,
  })
  @IsOptional()
  @IsString()
  observation?: string;

  @ApiProperty({
    description: 'Imagen en base64',
    example: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...',
    required: false,
  })
  @IsOptional()
  @IsString()
  base64?: string;

  @ApiProperty({
    description: 'Formato de la imagen',
    example: 'image/jpeg',
    required: false,
  })
  @IsOptional()
  @IsString()
  format?: string;
}
