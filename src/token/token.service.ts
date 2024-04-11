import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  async generateToken(user: any) {
    const payload = { id: user.id, email: user.email };

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: 60 * 10,
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: '1d',
      }),
    };
  }

  async generateAccessToken(user: any) {
    const payload = { id: user.id, email: user.email };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: 60 * 10,
    });

    return accessToken;
  }

  async validateToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.SECRET_KEY || 'secret',
      });

      return payload ? true : false;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
