import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponseDto } from '@shared/dtos/paginated-response.dto';
import { MappedSampleDto } from './mapped-sample.dto';

export class SamplePaginatedResponseDto extends PaginatedResponseDto<MappedSampleDto> {
  @ApiProperty({ type: [MappedSampleDto] })
  declare items: MappedSampleDto[];
}
