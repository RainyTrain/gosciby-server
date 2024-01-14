export enum Roles {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export class CreateUserDto {
  email: string;
  password: string;
  roles: Roles[];
}
