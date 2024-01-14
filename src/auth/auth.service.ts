import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/users/dto/createUserDto';
import { UsersService } from 'src/users/users.service';
import { AuthUserDto } from './dto/authUserDto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  async signUp(dto: AuthUserDto) {
    const { email } = dto;
    const user = await this.prisma.user.findFirst({ where: { email: email } });

    if (user) {
      return 'This user already exists!';
    }

    return this.usersService.createUser(dto as CreateUserDto);
  }

  async signIn(dto: AuthUserDto) {
    const { email, password } = dto;
    const user = await this.prisma.user.findFirst({ where: { email: email } });

    if (!user) {
      return 'User not found';
    }

    const isPasswordValid = user.password === password;

    if (!isPasswordValid) {
      return 'Invalid password';
    }

    return 'Success!';
  }
}
