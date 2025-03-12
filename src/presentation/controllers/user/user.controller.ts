import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, HttpCode, HttpStatus, Logger, ParseIntPipe, ParseUUIDPipe } from "@nestjs/common";
import { CreateUserUseCase } from "src/core/domain/uses-cases/user/create-user.use-case";
import { CreateUserDto } from "./dtos/create-user.dto";
import { FindAllUsersUseCase } from "src/core/domain/uses-cases/user/find-all-user.use-case";
import { UpdateUserUseCase } from "src/core/domain/uses-cases/user/update-user.use-case";
import { DeleteUserUseCase } from "src/core/domain/uses-cases/user/delete-user.use-case";
import { FindUserUseCase } from "src/core/domain/uses-cases/user/find-user.use-case";
import { UpdateUserDto } from "./dtos/update-user.dto";

@Controller('user')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly findAllUsersUseCase: FindAllUsersUseCase,
    private readonly findUserByEmailUseCase: FindUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.createUserUseCase.execute(createUserDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllUsers(@Query('page', ParseIntPipe) page = 1, @Query('limit', ParseIntPipe) limit = 10) {
    return this.findAllUsersUseCase.execute(page, limit);
  }

  @Get(':email')
  @HttpCode(HttpStatus.OK)
  async getUserByEmail(@Param('email') email: string) {
    const user = await this.findUserByEmailUseCase.execute(email);
    if (!user) throw new NotFoundException(`Usuario con email ${email} no encontrado`);
    return user;
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateUser(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.updateUserUseCase.execute(id, updateUserDto);
  }

  @Delete(':email')
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Param('email') email: string) {
    await this.deleteUserUseCase.execute(email);
    return { message: `Usuario con email ${email} eliminado correctamente.` };
  }
}
