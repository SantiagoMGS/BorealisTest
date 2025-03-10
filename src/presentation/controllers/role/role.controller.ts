import { Body, Controller, Post } from "@nestjs/common";
import { CreateRoleUseCase } from "src/core/domain/uses-cases/role/crate-role.user-case";
import { CreateRoleDto } from "../dtos/create-role.dto";

@Controller('api/role')
export class RoleController {
  constructor(
    private readonly createRoleUseCase: CreateRoleUseCase
  ) { }


  @Post('create-role')
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.createRoleUseCase.execute(createRoleDto);
  }
 

}
