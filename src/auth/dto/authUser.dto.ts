import { IsEmail, Length, MaxLength, MinLength } from 'class-validator';

export class AuthUserDto {
  @IsEmail()
  @MinLength(5, { message: 'Email is too short!' })
  @MaxLength(20, { message: 'Email is too long!' })
  email: string;

  @Length(5, 15)
  password: string;
}
