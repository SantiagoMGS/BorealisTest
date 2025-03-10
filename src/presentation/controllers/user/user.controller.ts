import { Body, Controller, Post } from "@nestjs/common";
import { CreateUserUseCase } from "src/core/domain/uses-cases/user/create-user.use-case";
import { CreateUserDto } from "../dtos/create-user.dto";

@Controller('api/user')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase
  ) { }


  @Post('create-user')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.createUserUseCase.execute(createUserDto);
  }
 

}
