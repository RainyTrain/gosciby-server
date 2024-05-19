import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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
    try {
      const { email, password } = dto;
      const user = await this.prisma.user.findFirst({
        where: { email: email },
      });

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

      if (!newUser) {
        throw new Error();
      }

      return { ...newUser, accessToken };
    } catch (error) {
      throw new HttpException('Error with signing up', 401);
    }
  }

  async signIn(dto: AuthUserDto) {
    try {
      const { email, password } = dto;
      const user = await this.prisma.user.findFirst({
        where: { email: email },
      });

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

      if (!updatedPlayer) {
        throw new Error();
      }

      return { ...updatedPlayer, accessToken };
    } catch (error) {
      throw new HttpException('Error with signing in', 401);
    }
  }

  async signOut(request: Request, response: Response) {
    try {
      const { refreshToken } = request.cookies;

      const user = await this.prisma.user.findFirst({
        where: { refreshToken: refreshToken },
      });

      if (!user?.refreshToken) {
        return 'No user';
      }

      const updatedUser = await this.prisma.user.update({
        where: { id: user.id },
        data: { ...user, refreshToken: null },
      });

      if (!updatedUser) {
        throw new Error();
      }

      response.clearCookie('refreshToken');

      return updatedUser;
    } catch (error) {
      throw new HttpException('Error with signing out', 401);
    }
  }

  async refreshAccessToken(refreshToken: string) {
    try {
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
    } catch (error) {
      throw new HttpException('Error with refreshing access token', 401);
    }
  }

  async setAccessTokenCookie(response: Response, refreshToken: string) {
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    });
  }
}
