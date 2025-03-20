import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsString,
  IsUUID,
  ArrayNotEmpty,
  IsNotEmpty,
} from 'class-validator';

export class AssignPermissionsDto {
  @ApiProperty({
    description: 'The UUID of the role',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  roleId!: string;

  @ApiProperty({
    description: 'List of permission IDs to assign to the role',
    example: [
      {
        actionId: '123e4567-e89b-12d3-a456-426614174001',
        resourceId: '123e4567-e89b-12d3-a456-426614174002',
      },
      {
        actionId: '123e4567-e89b-12d3-a456-426614174003',
        resourceId: '123e4567-e89b-12d3-a456-426614174004',
      },
    ],
    type: 'array',
    items: {
      type: 'object',
      properties: {
        actionId: { type: 'string', format: 'uuid' },
        resourceId: { type: 'string', format: 'uuid' },
      },
    },
  })
  @IsArray()
  @IsNotEmpty()
  permissions!: { actionId: string; subresourceId: string }[];
}
