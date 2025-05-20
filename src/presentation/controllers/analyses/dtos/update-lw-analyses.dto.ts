import { ApiProperty } from '@nestjs/swagger';

export class UpdateLWAnalysisDto {
  @ApiProperty({})
  id!: string;

  @ApiProperty({})
  realDateTime!: string;
}
