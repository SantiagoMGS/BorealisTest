import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateResourceDto {
  @ApiProperty({
    example: 'Operario',
    description: 'Nombre del rol',
    required: true
  })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser un texto' })
  name!: string;

  @IsNotEmpty({ message: 'El icono del recurso es obligatorio' })
  @IsString({ message: 'El icono debe ser un texto' })
  icon!: string;

  @IsNotEmpty({ message: 'El icono del recurso es obligatorio' })
  @IsString({ message: 'El icono debe ser un texto' })
  path!: string;
}