import { IsEmail, Length, MaxLength, MinLength } from 'class-validator';

export class AuthUserDto {
  @IsEmail()
  @MinLength(5)
  @MaxLength(20)
  email: string;

  @Length(5, 15)
  password: string;
}
