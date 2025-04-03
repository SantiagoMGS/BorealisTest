import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { CreateResourceDto } from './create-resource.dto';

export class UpdateResourceDto extends PartialType(CreateResourceDto) {
  @ApiProperty({
    example: 'User Management',
    description: 'Nombre del recurso',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser un texto' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  name?: string;

  @IsOptional({ message: 'El icono del recurso es obligatorio' })
  @IsString({ message: 'El icono debe ser un texto' })
  icon!: string;
}