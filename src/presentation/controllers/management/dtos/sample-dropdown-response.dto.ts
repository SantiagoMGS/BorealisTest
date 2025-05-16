import { ApiProperty } from '@nestjs/swagger';
import { ReceptionOriginDropdownDto } from './reception-origin-dropdown.dto';
import { SampleDropdownDto } from './sample-dropdown.dto';
import { SupplierDropdownDto } from './supplier-dropdown.dto';

export class SampleDropdownResponseDto {
  @ApiProperty({ type: [SupplierDropdownDto] })
  suppliers!: SupplierDropdownDto[];

  @ApiProperty({ type: [SampleDropdownDto] })
  samples!: SampleDropdownDto[];

  @ApiProperty({ type: [ReceptionOriginDropdownDto] })
  receptionOrigins!: ReceptionOriginDropdownDto[];
}
