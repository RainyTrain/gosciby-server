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
import { AccomodationModule } from './accomodation/accomodation.module';
import { BookingModule } from './booking/booking.module';
import * as path from 'path';
import { ScheduleModule } from '@nestjs/schedule';
import { FeedbackModule } from './feedback/feedback.module';

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
    AccomodationModule,
    BookingModule,
    ScheduleModule.forRoot(),
    FeedbackModule,
  ],
  controllers: [MainController],
  providers: [AdminService],
})
export class AppModule {}
