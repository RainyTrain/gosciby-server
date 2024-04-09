import { IsEmail, Length, MaxLength, MinLength } from 'class-validator';

export enum Roles {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export class CreateUserDto {
  @IsEmail()
  @MinLength(5, { message: 'Email is too short!' })
  @MaxLength(20, { message: 'Email is too long!' })
  email: string;

  // create custom decorator to ensure that password contains special signs
  @Length(5, 15)
  password: string;

  role?: Roles[];
}
