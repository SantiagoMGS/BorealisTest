import { ApiProperty } from '@nestjs/swagger';
import { PaginationMeta } from '@shared/dtos/paginator.dto';

export abstract class PaginatedResponseDto<T> {
  @ApiProperty()
  items!: T[];

  @ApiProperty()
  meta!: PaginationMeta;
}
