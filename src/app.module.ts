import { Module } from '@nestjs/common';
import { MainController } from './app.controller';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsersModule, AuthModule, PrismaModule],
  controllers: [MainController],
})
export class AppModule {}
