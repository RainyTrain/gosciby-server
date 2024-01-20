import { Module } from '@nestjs/common';
import { MainController } from './app.controller';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [UsersModule, AuthModule, PrismaModule, ProfileModule],
  controllers: [MainController],
})
export class AppModule {}
