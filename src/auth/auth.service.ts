import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/users/dto/createUser.dto';
import { UsersService } from 'src/users/users.service';
import { AuthUserDto } from './dto/authUser.dto';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { TokenService } from 'src/token/token.service';

export interface User extends CreateUserDto {
  id: number;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private tokenService: TokenService,
  ) {}

  async signUp(dto: AuthUserDto) {
    const { email, password } = dto;
    const user = await this.prisma.user.findFirst({ where: { email: email } });

    if (user) {
      return 'This user already exists!';
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const { accessToken, refreshToken } =
      await this.tokenService.generateToken(dto);

    const newUser = await this.usersService.createUser({
      ...dto,
      refreshToken: refreshToken,
      password: hashPassword,
    } as CreateUserDto);

    return { ...newUser, accessToken };
  }

  async signIn(dto: AuthUserDto) {
    const { email, password } = dto;
    const user = await this.prisma.user.findFirst({ where: { email: email } });

    console.log(user);

    if (!user) {
      return 'User not found';
    }

    const hashedUserPassword = await bcrypt.compare(password, user.password);

    if (!hashedUserPassword) {
      return 'Invalid password';
    }

    const { accessToken, refreshToken } =
      await this.tokenService.generateToken(user);

    const updatedPlayer = await this.prisma.user.update({
      where: { email: email },
      data: { ...user, refreshToken: refreshToken },
    });

    return { ...updatedPlayer, accessToken };
  }

  async signOut(request: Request, response: Response) {
    const { refreshToken } = request.cookies;

    const user = await this.prisma.user.findFirst({
      where: { refreshToken: refreshToken },
    });

    if (!user?.refreshToken) {
      return 'No user';
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { ...user, refreshToken: null },
    });

    response.clearCookie('refreshToken');
  }

  async refreshAccessToken(refreshToken: string) {
    const user = this.prisma.user.findFirst({
      where: {
        refreshToken: refreshToken,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const payload = await this.tokenService.validateToken(refreshToken);

    if (!payload) {
      return 'Refresh token is invalid!';
    }

    const accessToken = await this.tokenService.generateAccessToken(user);

    return accessToken;
  }

  async setAccessTokenCookie(response: Response, refreshToken: string) {
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    });
  }
}
