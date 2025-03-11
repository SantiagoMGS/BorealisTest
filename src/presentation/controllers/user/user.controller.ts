import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query } from "@nestjs/common";
import { CreateUserUseCase } from "src/core/domain/uses-cases/user/create-user.use-case";
import { CreateUserDto } from "./dtos/create-user.dto";
import { FindAllUsersUseCase } from "src/core/domain/uses-cases/user/find-all-user.use-case";
import { UpdateUserUseCase } from "src/core/domain/uses-cases/user/update-user.use-case";
import { DeleteUserUseCase } from "src/core/domain/uses-cases/user/delete-user.use-case";
import { FindUserUseCase } from "src/core/domain/uses-cases/user/find-user.use-case";
import { UpdateUserDto } from "./dtos/update-user.dto";

@Controller('api/user')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly findAllUsersUseCase: FindAllUsersUseCase,
    private readonly findUserByEmailUseCase: FindUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase
  ) { }


  @Post('create-user')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.createUserUseCase.execute(createUserDto);
  }
  @Get()
  async getAllUsers(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.findAllUsersUseCase.execute(Number(page), Number(limit));
  }
  @Get(':email')
  async getUserByEmail(@Param('email') email: string) {
    const user = await this.findUserByEmailUseCase.execute(email);
    if (!user) throw new NotFoundException(`Usuario con email ${email} no encontrado`);
    return user;
  }
  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.updateUserUseCase.execute(id, updateUserDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.deleteUserUseCase.execute(id);
  }
}
