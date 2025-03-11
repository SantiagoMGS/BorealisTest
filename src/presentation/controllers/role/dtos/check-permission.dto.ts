import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CheckPermissionDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID del rol' })
  @IsUUID()
  roleId: string;

  @ApiProperty({ example: '1', description: 'ID de la acción' })
  @IsUUID()
  actionId: string;

  @ApiProperty({ example: '1', description: 'ID del recurso' })
  @IsUUID()
  resourceId: string;
}
