import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthUserDto } from './dto/authUserDto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() dto: AuthUserDto) {
    return await this.authService.signUp(dto);
  }

  @Post('sign-in')
  async signIn(
    @Res({ passthrough: true }) response: Response,
    @Body() dto: AuthUserDto,
  ) {
    const token = await this.authService.signIn(dto);

    const { accessToken } = token as { accessToken: string };

    this.authService.createCookie(response, accessToken);

    return token;
  }
}
