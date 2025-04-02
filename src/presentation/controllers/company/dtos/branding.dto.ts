// branding.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsHexColor } from 'class-validator';

export class CompanyBrandingDto {
  @ApiProperty({ example: 'logo.png', description: 'Nombre del logo' })
  @IsNotEmpty({ message: 'El logo es obligatorio' })
  @IsString()
  logo!: string;

  @ApiProperty({ example: '#FFFFFF', description: 'Color primario' })
  @IsNotEmpty()
  @IsHexColor()
  primaryColor!: string;

  @ApiProperty({ example: '#000000', description: 'Color secundario' })
  @IsNotEmpty()
  @IsHexColor()
  secondaryColor!: string;

  @ApiProperty({ example: '#FF0000', description: 'Color terciario' })
  @IsNotEmpty()
  @IsHexColor()
  tertiaryColor!: string;
}
