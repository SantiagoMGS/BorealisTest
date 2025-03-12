import { IsOptional, IsString, IsUUID, IsPhoneNumber } from 'class-validator';

export class UpdateCompanyDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsOptional()
  @IsString()
  name?: string;


}
