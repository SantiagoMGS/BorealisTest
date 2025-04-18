import { ApiProperty } from '@nestjs/swagger';
import {
  ILoginResponse,
  ICompanyResponse,
  ICompanyBranding,
  ITokens,
} from '@domain/interfaces/auth/login-response.interface';

export class CompanyBrandingDto implements ICompanyBranding {
  @ApiProperty({
    description: 'Logo de la compañía',
    example: 'https://example.com/logo.png',
    nullable: true,
  })
  logo!: string | null;

  @ApiProperty({
    description: 'Color primario de la marca',
    example: '#0066CC',
    nullable: true,
  })
  primaryColor!: string | null;

  @ApiProperty({
    description: 'Color secundario de la marca',
    example: '#FF9900',
    nullable: true,
  })
  secondaryColor!: string | null;

  @ApiProperty({
    description: 'Color terciario de la marca',
    example: '#333333',
    nullable: true,
  })
  tertiaryColor!: string | null;
}

export class CompanyResponseDto implements ICompanyResponse {
  @ApiProperty({
    description: 'ID único de la compañía',
    example: '12345678-1234-1234-1234-123456789012',
  })
  id!: string;

  @ApiProperty({
    description: 'Nombre de la compañía',
    example: 'Empresa Ejemplo S.A.',
  })
  name!: string;

  @ApiProperty({
    description: 'Nombre corto de la compañía',
    example: 'Ejemplo',
  })
  shortName!: string;

  @ApiProperty({
    description: 'ID del rol del usuario en la compañía',
    example: '12345678-1234-1234-1234-123456789012',
  })
  role!: string;

  @ApiProperty({
    description: 'Información de branding de la compañía',
    type: CompanyBrandingDto,
    nullable: true,
  })
  branding!: CompanyBrandingDto | null;
}

export class TokensDto implements ITokens {
  @ApiProperty({
    description: 'Token de acceso JWT',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token!: string;

  @ApiProperty({
    description: 'Token de refresco JWT',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refresh_token!: string;
}

export class LoginResponseDto implements ILoginResponse {
  @ApiProperty({
    description: 'ID único del usuario',
    example: '12345678-1234-1234-1234-123456789012',
  })
  id!: string;

  @ApiProperty({
    description: 'Compañías a las que tiene acceso el usuario',
    type: [CompanyResponseDto],
  })
  companies!: CompanyResponseDto[];

  @ApiProperty({
    description: 'Tokens de autenticación',
    type: TokensDto,
  })
  tokens!: TokensDto;
}

export class ErrorResponseDto {
  @ApiProperty({
    description: 'Código de estado HTTP',
    example: 401,
  })
  statusCode!: number;

  @ApiProperty({
    description: 'Mensaje de error',
    example: 'Credenciales incorrectas',
  })
  message!: string;

  @ApiProperty({
    description: 'Ruta que generó el error',
    example: '/auth/login',
  })
  path!: string;

  @ApiProperty({
    description: 'Marca de tiempo',
    example: '2023-01-01T00:00:00.000Z',
  })
  timestamp!: string;
}
