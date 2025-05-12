import { LoginDto } from '../dtos';
import { ILoginEntity } from '@domain/entities/auth';
import { ILoginResponse } from '@domain/interfaces/auth';
import { LoginResponseDto } from '../dtos';

export class LoginMapper {
  static toEntity(dto: LoginDto): ILoginEntity {
    return {
      email: dto.email,
      password: dto.password,
    };
  }

  static toResponseDto(entity: ILoginResponse): LoginResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      companies: entity.companies,
      tokens: entity.tokens,
    };
  }
}
