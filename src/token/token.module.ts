import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token.service';

@Module({
  providers: [TokenService],
  exports: [TokenService],
  imports: [
    JwtModule.register({
      secret: process.env.SECRET_KEY || 'secret',
    }),
  ],
})
export class TokenModule {}
