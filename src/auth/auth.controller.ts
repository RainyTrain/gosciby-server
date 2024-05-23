import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  ValidationPipe,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { showErrorFields } from 'src/exceptions/showErrorFields';
import { AuthService } from './auth.service';
import { AuthUserDto } from './dto/authUser.dto';

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
    @Body(
      new ValidationPipe({
        exceptionFactory: (errors) => showErrorFields(errors),
      }),
    )
    dto: AuthUserDto,
  ) {
    const token = await this.authService.signIn(dto);

    const { refreshToken } = token as { refreshToken: string };

    await this.authService.setAccessTokenCookie(response, refreshToken);

    return token;
  }

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
