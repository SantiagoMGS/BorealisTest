import { LoginDto } from '../dtos';
import { ILoginEntity } from '@domain/entities/auth';
import { ILogin } from '@domain/interfaces/auth';
import { LoginResponseDto } from '../dtos';

export class LoginMapper {
  static toEntity(dto: LoginDto): ILoginEntity {
    return {
      email: dto.email,
      password: dto.password,
    };
  }

  static toResponseDto(entity: ILogin): LoginResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      companies: entity.companies,
      tokens: entity.tokens,
    };
  }
}
