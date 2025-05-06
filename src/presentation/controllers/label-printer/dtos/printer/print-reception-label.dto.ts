import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsOptional,
  IsBoolean,
  Min,
  IsUUID,
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PrintReceptionLabelDto {
  @ApiProperty({
    description: 'ID de la muestra',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: 'El ID de muestra no puede estar vacío' })
  @IsString({ message: 'El ID de muestra debe ser una cadena de caracteres' })
  @IsUUID('4', { message: 'El ID de muestra debe ser un UUID válido' })
  sampleId!: string;

  @ApiProperty({
    description: 'Cantidad de etiquetas a imprimir',
    example: 2,
    default: 1,
  })
  @IsInt({ message: 'La cantidad debe ser un número entero' })
  @Min(1, { message: 'La cantidad debe ser al menos 1' })
  count!: number;

  @ApiProperty({
    description: 'Nombre de la impresora',
    example: 'Impresora de Recepción',
    required: false,
  })
  @IsOptional()
  @IsString({
    message: 'El nombre de la impresora debe ser una cadena de caracteres',
  })
  printerName?: string;

  @ApiProperty({
    description: 'Si se debe omitir la prueba de conexión',
    example: false,
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'skipConnectionTest debe ser un valor booleano' })
  skipConnectionTest?: boolean;
}
