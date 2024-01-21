import { Body, Controller, Post, Res, UsePipes } from '@nestjs/common';
import { Response } from 'express';
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

    const { accessToken } = token as { accessToken: string };

    await this.authService.createCookie(response, accessToken);

    return token;
  }
}
