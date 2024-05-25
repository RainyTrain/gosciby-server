import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export enum Roles {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export class CreateUserDto {
  @IsEmail()
  @MinLength(5)
  @MaxLength(20)
  email: string;

  @IsString()
  @Length(5, 15)
  password: string;

  @IsOptional()
  @IsString()
  refreshToken?: string;

  @IsOptional()
  @IsEnum(Roles)
  role?: Roles[];
}
