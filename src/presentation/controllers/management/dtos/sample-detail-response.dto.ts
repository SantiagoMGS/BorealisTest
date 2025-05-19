import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';

class ReceptionOriginDto {
  @ApiProperty({
    description: 'ID del origen de recepción',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'Nombre del origen de recepción',
    example: 'CONCENTRADO FLOTACION',
  })
  name!: string;

  @ApiProperty({
    description: 'Nombre corto del origen de recepción',
    example: 'CF',
  })
  shortName!: string;
}

class StatusDto {
  @ApiProperty({
    description: 'ID del estado',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'Nombre del estado',
    example: 'RECIBIDO',
  })
  name!: string;
}

class SubSampleDto {
  @ApiProperty({
    description: 'ID de la submuestra',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'Código de la submuestra',
    example: 'SUB-001',
  })
  code!: string;
}

class AnalysisTypeDto {
  @ApiProperty({
    description: 'ID del tipo de análisis',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'Nombre del tipo de análisis',
    example: 'ABSORCION ATOMICA',
  })
  name!: string;

  @ApiProperty({
    description: 'Nombre corto del tipo de análisis',
    example: 'AA',
  })
  shortName!: string;
}

class RequiredAnalysisDto {
  @ApiProperty({
    description: 'ID del análisis requerido',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'ID de la muestra',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  sampleId!: string;

  @ApiProperty({
    description: 'ID del tipo de análisis',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  analysisTypeId!: string;

  @ApiProperty({
    description: 'Indica si el análisis está completado',
    example: false,
  })
  done!: boolean;

  @ApiProperty({
    description: 'Tipo de análisis',
    type: AnalysisTypeDto,
  })
  analysisType!: AnalysisTypeDto;
}

class AnalysisDto {
  @ApiProperty({
    description: 'ID del análisis',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'ID del tipo de análisis',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  analysisTypeId!: string;

  @ApiProperty({
    description: 'ID de la muestra',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  sampleId!: string;

  @ApiProperty({
    description: 'Valor del resultado',
    example: { done: false, time: 30, endDateTime: '2025-05-10T20:00:00.000Z' },
  })
  resultValue!: any;

  @ApiProperty({
    description: 'Fecha del análisis',
    example: '2025-05-10T19:30:00.000Z',
  })
  analysisDate!: Date;

  @ApiProperty({
    description: 'Indica si está activo',
    example: true,
  })
  isActive!: boolean;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2025-05-19T15:56:33.469Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Fecha de actualización',
    example: '2025-05-19T15:56:33.469Z',
  })
  updatedAt!: Date;

  @ApiProperty({
    description: 'Tipo de análisis',
    type: AnalysisTypeDto,
  })
  analysisType!: AnalysisTypeDto;
}

class SupplierDto {
  @ApiProperty({
    description: 'ID del proveedor',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'Nombre del proveedor',
    example: 'Cooperativa Minera del Pacífico',
  })
  name!: string;

  @ApiProperty({
    description: 'Nombre corto del proveedor',
    example: 'CO5678',
  })
  shortName!: string;
}

class SampleDto {
  @ApiProperty({
    description: 'ID de la muestra',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'ID de la recepción',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  receptionId!: string;

  @ApiProperty({
    description: 'ID del origen de recepción',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  receptionOriginId!: string;

  @ApiProperty({
    description: 'Peso recibido',
    example: '420.3',
  })
  receivedWeight!: Decimal;

  @ApiProperty({
    description: 'Código de la muestra',
    example: 'COOPA-MM-250510',
  })
  code!: string;

  @ApiProperty({
    description: 'ID del estado',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  statusId!: string;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2025-05-19T15:56:33.413Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Fecha de actualización',
    example: '2025-05-19T15:56:33.413Z',
  })
  updatedAt!: Date;

  @ApiProperty({
    description: 'ID del creador',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  createdBy!: string | null;

  @ApiProperty({
    description: 'ID del actualizador',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  updatedBy!: string | null;

  @ApiProperty({
    description: 'Origen de recepción',
    type: ReceptionOriginDto,
  })
  receptionOrigin!: ReceptionOriginDto;

  @ApiProperty({
    description: 'Estado de la muestra',
    type: StatusDto,
  })
  status!: StatusDto;

  @ApiProperty({
    description: 'Análisis requeridos',
    type: [RequiredAnalysisDto],
  })
  requiredAnalyses!: RequiredAnalysisDto[];

  @ApiProperty({
    description: 'Análisis realizados',
    type: [AnalysisDto],
  })
  analyses!: AnalysisDto[];

  @ApiProperty({
    description: 'Submuestras',
    type: [SubSampleDto],
  })
  subSamples!: SubSampleDto[];
}

export class SampleDetailResponseDto {
  @ApiProperty({
    description: 'ID de la recepción',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'ID de la compañía',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  companyId!: string;

  @ApiProperty({
    description: 'ID del proveedor',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  supplierId!: string;

  @ApiProperty({
    description: 'Fecha de recepción',
    example: '2025-05-10T00:00:00.000Z',
  })
  receptionDate!: Date;

  @ApiProperty({
    description: 'Número de lote',
    example: 'COOPA-M-2025-1',
  })
  batchNumber!: string | null;

  @ApiProperty({
    description: 'Observaciones',
    example:
      'Concentrado de flotación para análisis de contenido de oro y plata',
  })
  observation!: string | null;

  @ApiProperty({
    description: 'Indica si está activo',
    example: true,
  })
  isActive!: boolean;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2025-05-19T15:56:33.405Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Fecha de actualización',
    example: '2025-05-19T15:56:33.405Z',
  })
  updatedAt!: Date;

  @ApiProperty({
    description: 'ID del creador',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  createdBy!: string | null;

  @ApiProperty({
    description: 'ID del actualizador',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  updatedBy!: string | null;

  @ApiProperty({
    description: 'ID del origen de recepción',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  receptionOriginId!: string;

  @ApiProperty({
    description: 'ID del tipo de recepción',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  receptionTypeId!: string;

  @ApiProperty({
    description: 'ID del título minero',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  miningTitleId!: string | null;

  @ApiProperty({
    description: 'ID de la ciudad',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  cityId!: string | null;

  @ApiProperty({
    description: 'Datos del proveedor',
    type: SupplierDto,
  })
  supplier!: SupplierDto;

  @ApiProperty({
    description: 'Muestras',
    type: [SampleDto],
  })
  samples!: SampleDto[];
}
