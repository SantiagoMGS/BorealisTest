import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CheckPermissionDto {
  @ApiProperty({
    description: 'The UUID of the role',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  @IsNotEmpty()
  roleId: string;

  @ApiProperty({
    description: 'The UUID of the action',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @IsUUID()
  @IsNotEmpty()
  actionId: string;

  @ApiProperty({
    description: 'The UUID of the resource',
    example: '123e4567-e89b-12d3-a456-426614174002'
  })
  @IsUUID()
  @IsNotEmpty()
  resourceId: string;
}