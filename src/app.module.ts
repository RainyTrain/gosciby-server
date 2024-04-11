import { Module } from '@nestjs/common';
import { MainController } from './app.controller';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { AdminService } from './admin/admin.service';
import { AdminModule } from './admin/admin.module';
import { TokenModule } from './token/token.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    PrismaModule,
    ProfileModule,
    AdminModule,
    TokenModule,
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, '..', 'static', 'avatars'),
    }),
  ],
  controllers: [MainController],
  providers: [AdminService],
})
export class AppModule {}
