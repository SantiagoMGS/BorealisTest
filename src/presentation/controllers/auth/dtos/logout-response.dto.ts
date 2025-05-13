import { ApiProperty } from '@nestjs/swagger';

export class LogoutResponseDto {
  @ApiProperty({
    description: 'Indica si la operación de cierre de sesión fue exitosa',
    example: true,
  })
  success!: boolean;
}
