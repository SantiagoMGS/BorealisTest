import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { CreateRoleDto } from './create-role.dto';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {

  @ApiProperty({
    description: 'The name of the role',
    example: 'Super Admin',
    required: false
  })
  @IsString()
  @IsOptional()
  name?: string;

}
