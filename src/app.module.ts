import { Module } from '@nestjs/common';
import { MainController } from './app.controller';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { AdminService } from './admin/admin.service';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [UsersModule, AuthModule, PrismaModule, ProfileModule, AdminModule],
  controllers: [MainController],
  providers: [AdminService],
})
export class AppModule {}
