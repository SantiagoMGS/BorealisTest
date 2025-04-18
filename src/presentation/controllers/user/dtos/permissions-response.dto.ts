import { ApiProperty } from '@nestjs/swagger';
import {
  IActionResponse,
  IApplicationResponse,
  ICompanyBrandingResponse,
  IPermissionsByCompanyResponse,
  IResourceResponse,
  ISubresourceResponse,
  IRoleResponse,
} from '@domain/interfaces/user/permission-response.interface';

export class ActionResponseDto implements IActionResponse {
  @ApiProperty({
    description: 'ID de la acción',
    example: '2775a0fe-b877-4dfb-af5b-fea0abdfd013',
  })
  id!: string;

  @ApiProperty({
    description: 'Nombre de la acción',
    example: 'DELETE',
  })
  name!: string;

  @ApiProperty({
    description: 'Nivel de la acción',
    example: 4,
  })
  level!: number;
}

export class SubresourceResponseDto implements ISubresourceResponse {
  @ApiProperty({
    description: 'ID del subrecurso',
    example: '029d5411-4b62-48bd-bc0b-0e995c174a95',
  })
  id!: string;

  @ApiProperty({
    description: 'Nombre del subrecurso',
    example: 'Recepción',
  })
  name!: string;

  @ApiProperty({
    description: 'Icono del subrecurso',
    example: 'flask-sample',
  })
  icon!: string;

  @ApiProperty({
    description: 'Ruta del subrecurso',
    example: '/gestion-muestras',
  })
  path!: string;

  @ApiProperty({
    description: 'Acción permitida para el subrecurso',
    type: ActionResponseDto,
  })
  action!: ActionResponseDto;
}

export class ResourceResponseDto implements IResourceResponse {
  @ApiProperty({
    description: 'ID del recurso',
    example: '234d7438-a4e3-4ad3-9d97-1a504acb8cce',
  })
  id!: string;

  @ApiProperty({
    description: 'Nombre del recurso',
    example: 'Recepción',
  })
  name!: string;

  @ApiProperty({
    description: 'Icono del recurso',
    example: 'user-group',
  })
  icon!: string;

  @ApiProperty({
    description: 'Ruta del recurso',
    example: '/reception',
  })
  path!: string;

  @ApiProperty({
    description: 'Subrecursos del recurso',
    type: [SubresourceResponseDto],
  })
  subresources!: SubresourceResponseDto[];
}

export class ApplicationResponseDto implements IApplicationResponse {
  @ApiProperty({
    description: 'ID de la aplicación',
    example: '5dddcd73-ab48-427d-bdb3-98382a4ab119',
  })
  id!: string;

  @ApiProperty({
    description: 'Nombre de la aplicación',
    example: 'LIMS',
  })
  name!: string;

  @ApiProperty({
    description: 'Ruta de la aplicación',
    example: 'lims',
  })
  path!: string;

  @ApiProperty({
    description: 'Si la aplicación está activa',
    example: true,
  })
  isActive!: boolean;

  @ApiProperty({
    description: 'Recursos de la aplicación',
    type: [ResourceResponseDto],
  })
  resources!: ResourceResponseDto[];
}

export class CompanyBrandingResponseDto implements ICompanyBrandingResponse {
  @ApiProperty({
    description: 'Logo de la compañía',
    example: 'https://example.com/logo.png',
    nullable: true,
  })
  logo?: string | null;

  @ApiProperty({
    description: 'Color primario de la marca',
    example: '#0066CC',
    nullable: true,
  })
  primaryColor?: string | null;

  @ApiProperty({
    description: 'Color secundario de la marca',
    example: '#FF9900',
    nullable: true,
  })
  secondaryColor?: string | null;

  @ApiProperty({
    description: 'Color terciario de la marca',
    example: '#333333',
    nullable: true,
  })
  tertiaryColor?: string | null;
}

export class CompanyInfoDto {
  @ApiProperty({
    description: 'ID de la compañía',
    example: '12345678-1234-1234-1234-123456789012',
  })
  id!: string;

  @ApiProperty({
    description: 'Nombre de la compañía',
    example: 'Empresa Ejemplo S.A.',
  })
  name?: string;

  @ApiProperty({
    description: 'Nombre corto de la compañía',
    example: 'Ejemplo',
  })
  shortName?: string;

  @ApiProperty({
    description: 'Información de branding de la compañía',
    type: CompanyBrandingResponseDto,
    nullable: true,
  })
  branding!: CompanyBrandingResponseDto | null;
}

export class RoleResponseDto implements IRoleResponse {
  @ApiProperty({
    description: 'ID del rol',
    example: '12345678-1234-1234-1234-123456789012',
  })
  id!: string;

  @ApiProperty({
    description: 'Nombre del rol',
    example: 'Administrador',
  })
  name!: string;
}

export class PermissionsByCompanyResponseDto
  implements IPermissionsByCompanyResponse
{
  @ApiProperty({
    description: 'Información de la compañía',
    type: CompanyInfoDto,
  })
  company!: CompanyInfoDto;

  @ApiProperty({
    description: 'Rol del usuario en la compañía',
    type: RoleResponseDto,
  })
  role!: RoleResponseDto;

  @ApiProperty({
    description: 'Aplicaciones disponibles para el usuario en la compañía',
    type: [ApplicationResponseDto],
  })
  applications!: ApplicationResponseDto[];
}
