import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { AuthService } from './auth.service';
import { AuthUserDto } from './dto/authUser.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UsePipes(ValidationPipe)
  @Post('sign-up')
  async signUp(@Body() dto: AuthUserDto) {
    return await this.authService.signUp(dto);
  }

  @UsePipes(ValidationPipe)
  @Post('sign-in')
  async signIn(
    @Res({ passthrough: true }) response: Response,
    @Body() dto: AuthUserDto,
  ) {
    const token = await this.authService.signIn(dto);

    const { refreshToken } = token as { refreshToken: string };

    await this.authService.setAccessTokenCookie(response, refreshToken);

    return token;
  }

  @UsePipes(ValidationPipe)
  @Post('sign-out')
  async signOut(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.signOut(request, response);
  }

  @Get('refresh')
  async refreshAccessToken(@Req() request: Request) {
    try {
      const { refreshToken } = request.cookies;

      const accessToken =
        await this.authService.refreshAccessToken(refreshToken);

      return accessToken;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
