import { Controller, Get, Query } from '@nestjs/common';
import { DropdownDataDto } from './dtos';
import { GetSampleDropdownDataUseCase } from '@domain/use-cases/manegement/get-sample-dropdown-data.usecase';

@Controller('sample-management')
export class SampleManagementController {
  constructor(
    private readonly getSampleDropdownDataUseCase: GetSampleDropdownDataUseCase,
  ) {}
  @Get('dropdown-data')
  async getDropdownData(@Query() queryParams: DropdownDataDto) {
    const dropdownData = await this.getSampleDropdownDataUseCase.execute(
      queryParams.startDate,
      queryParams.endDate,
    );
    return dropdownData;
  }
}
