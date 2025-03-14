import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class RemovePermissionDto {
  @ApiProperty({
    description: 'ID del rol',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID(4, { message: 'El roleId debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El roleId es requerido' })
  roleId: string;

  @ApiProperty({
    description: 'ID de la acción',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @IsUUID(4, { message: 'El actionId debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El actionId es requerido' })
  actionId: string;

  @ApiProperty({
    description: 'ID del recurso',
    example: '123e4567-e89b-12d3-a456-426614174002'
  })
  @IsUUID(4, { message: 'El resourceId debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El resourceId es requerido' })
  resourceId: string;
}