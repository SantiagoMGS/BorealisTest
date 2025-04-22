import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class SetCompanyDto {
  @ApiProperty({
    description: 'ID de la compañía a establecer',
    example: '12345678-1234-1234-1234-123456789012',
  })
  @IsNotEmpty({ message: 'El ID de la compañía es requerido' })
  @IsUUID('4', { message: 'El ID de la compañía debe ser un UUID válido' })
  companyId!: string;
}

export class SetCompanyResponseDto {
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
