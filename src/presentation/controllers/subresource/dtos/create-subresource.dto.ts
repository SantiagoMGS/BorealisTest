import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSubResourceDto {
  @ApiProperty({
    example: 'Operario',
    description: 'Nombre del rol',
    required: true
  })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser un texto' })
  name: string;

  @IsNotEmpty({ message: 'El id del recurso es obligatorio' })
  @IsString({ message: 'El id debe ser un texto' })
  resourceId: string;
}