import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/users/dto/createUser.dto';
import { UsersService } from 'src/users/users.service';
import { AuthUserDto } from './dto/authUser.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

interface User extends CreateUserDto {
  id: number;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(dto: AuthUserDto) {
    const { email, password } = dto;
    const user = await this.prisma.user.findFirst({ where: { email: email } });

    if (user) {
      return 'This user already exists!';
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await this.usersService.createUser({
      ...dto,
      password: hashPassword,
    } as CreateUserDto);

    return this.generateToken(newUser as User);
  }

  async signIn(dto: AuthUserDto) {
    const { email, password } = dto;
    const user = await this.prisma.user.findFirst({ where: { email: email } });

    if (!user) {
      return 'User not found';
    }

    const hashedUserPassword = await bcrypt.compare(password, user.password);

    if (!hashedUserPassword) {
      return 'Invalid password';
    }

    return this.generateToken(user as User);
  }

  async generateToken(user: User) {
    const payload = { id: user.id, email: user.email, roles: user.role };

    return { accessToken: await this.jwtService.signAsync(payload) };
  }

  async createCookie(request: Response, token: string) {
    request.cookie('accessToken', token, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 5),
    });
  }
}
