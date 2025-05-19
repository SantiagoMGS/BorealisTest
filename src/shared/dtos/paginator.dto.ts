import { IsNumber, IsOptional, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { IPaginationOptions } from '@shared/interfaces/pagination.interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto implements IPaginationOptions {
  @ApiProperty({
    description: 'Número de página (por defecto: 1)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  page: number = 1;

  @ApiProperty({
    description: 'Cantidad de elementos por página (por defecto: 10)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  limit: number = 10;

  @ApiProperty({
    description: 'Incluir elementos eliminados (por defecto: false)',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  withDeleted?: boolean = false;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}

export function Paginated<T>() {
  abstract class PaginatedResponseClass implements PaginatedResult<T> {
    items!: T[];
    meta!: PaginationMeta;
  }

  return PaginatedResponseClass;
}
