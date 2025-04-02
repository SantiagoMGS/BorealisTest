import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CompanyBrandingDto } from './branding.dto';

export class CreateCompanyDto {
  @ApiProperty({ example: 'Empresa S.A.' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({
    example: ['550e8400-e29b-41d4-a716-446655440000'],
    isArray: true,
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  applicationIds!: string[];

  @ApiProperty({ type: CompanyBrandingDto })
  @ValidateNested()
  @Type(() => CompanyBrandingDto)
  branding!: CompanyBrandingDto;
}
