import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {


  @ApiProperty({
    description: 'Nombre del Rol',
    example: 'Operario'
  })
  @IsString({ message: 'El nombre debe ser un texto' })
  @IsNotEmpty()
  name: string;

}