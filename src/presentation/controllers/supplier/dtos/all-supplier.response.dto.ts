import { ApiProperty } from '@nestjs/swagger';
import { SupplierResponseDto } from './supplier-response.dto';

export class AllSupplierResponseDto {
  @ApiProperty({ type: [SupplierResponseDto] })
  suppliers!: SupplierResponseDto[];
}
