import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class UpdateUserCompanyDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID del usuario' })
  @IsNotEmpty({ message: 'El userId es obligatorio' })
  @IsUUID('4', { message: 'El userId debe ser un UUID válido' })
  userId!: string;

  @ApiProperty({ example: '1', description: 'ID del rol, debe ser un UUID' })
  @IsNotEmpty({ message: 'El rol es obligatorio' })
  @IsUUID('4', { message: 'El roleId debe ser un UUID válido' })
  roleId!: string;

  @ApiProperty({ example: '2', description: 'ID de la empresa, debe ser un UUID' })
  @IsNotEmpty({ message: 'La empresa es obligatoria' })
  @IsUUID('4', { message: 'El companyId debe ser un UUID válido' })
  companyId!: string;
}
