import { IsIP, IsInt, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PrinterConfigDto {
  @ApiProperty({
    description: 'Dirección IP de la impresora',
    example: '192.168.1.123',
  })
  @IsIP(4, { message: 'La dirección IP debe tener un formato válido' })
  ip: string = '192.168.1.123';

  @ApiProperty({
    description: 'Puerto de la impresora',
    example: 9100,
    default: 9100,
  })
  @IsInt({ message: 'El puerto debe ser un número entero' })
  @Min(1, { message: 'El puerto debe ser mayor a 0' })
  @Max(65535, { message: 'El puerto debe ser menor a 65536' })
  port: number = 9100;

  @ApiProperty({
    description: 'Tiempo máximo de espera en milisegundos',
    example: 10000,
    default: 8000,
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'El timeout debe ser un número entero' })
  @Min(1000, { message: 'El timeout debe ser al menos 1000ms' })
  @Max(30000, { message: 'El timeout no debe exceder 30000ms' })
  timeout?: number;
}
