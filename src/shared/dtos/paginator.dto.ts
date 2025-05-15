import { Type } from '@nestjs/common';
import { IsNumber, IsOptional, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { IPaginationOptions } from '@shared/interfaces/pagination.interfaces';

export class PaginationDto implements IPaginationOptions {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  page: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  limit: number = 10;

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

export function Paginated<T>(itemType: Type<T>) {
  abstract class PaginatedResponseClass implements PaginatedResult<T> {
    items!: T[];
    meta!: PaginationMeta;
  }

  return PaginatedResponseClass;
}
