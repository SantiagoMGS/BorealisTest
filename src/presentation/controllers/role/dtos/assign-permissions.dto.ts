import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsUUID, ArrayNotEmpty } from 'class-validator';

export class AssignPermissionsDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID del rol' })
  @IsUUID()
  roleId: string;

  @ApiProperty({
    example: [{ actionId: '1', resourceId: '1' }],
    description: 'Lista de permisos a asignar',
  })
  @IsArray()
  @ArrayNotEmpty()
  permissions: { actionId: string; resourceId: string }[];
}
