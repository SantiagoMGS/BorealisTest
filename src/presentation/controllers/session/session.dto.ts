import { IsString, IsDate, IsOptional } from 'class-validator';

export class Session {
  @IsString()
  id!: string;

  @IsString()
  userId!: string;

  @IsString()
  token!: string;

  @IsOptional()
  @IsString()
  device?: string;

  @IsDate()
  lastActive!: Date;

  @IsDate()
  createdAt!: Date;

  @IsOptional()
  isActive?: boolean;

  constructor(data: Partial<Session>) {
    Object.assign(this, data);
  }
}