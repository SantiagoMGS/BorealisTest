import { 
  Body, 
  Controller, 
  Post, 
  Get, 
  Param, 
  Put, 
  Delete, 
  Query, 
  NotFoundException 
} from "@nestjs/common";
import { CreateRoleUseCase } from "src/core/domain/uses-cases/role/create-role.user-case";
import { DeleteRoleUseCase } from "src/core/domain/uses-cases/role/delete-role.use-case";
import { GetAllRolesUseCase } from "src/core/domain/uses-cases/role/get-all-roles.use-case";
import { GetRoleByIdUseCase } from "src/core/domain/uses-cases/role/get-role-by-id.use-case";
import { CreateRoleDto } from "./dtos/create-role.dto";
import { UpdateRoleDto } from "./dtos/update-role.dto";
import { UpdateRoleUseCase } from "src/core/domain/uses-cases/role/update-role.use-case";
@Controller('api/role')
export class RoleController {
  constructor(
    private readonly createRoleUseCase: CreateRoleUseCase,
    private readonly getAllRolesUseCase: GetAllRolesUseCase,
    private readonly getRoleByIdUseCase: GetRoleByIdUseCase,
    private readonly updateRoleUseCase: UpdateRoleUseCase,
    private readonly deleteRoleUseCase: DeleteRoleUseCase
  ) {}

  @Post('create-role')
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.createRoleUseCase.execute(createRoleDto);
  }

  @Get()
  async getAllRoles(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.getAllRolesUseCase.execute(Number(page), Number(limit));
  }

  @Get(':id')
  async getRoleById(@Param('id') id: string) {
    const role = await this.getRoleByIdUseCase.execute(id);
    if (!role) throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    return role;
  }

  @Put(':id')
  async updateRole(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.updateRoleUseCase.execute(id, updateRoleDto);
  }

  @Delete(':id')
  async deleteRole(@Param('id') id: string) {
    return this.deleteRoleUseCase.execute(id);
  }
}
