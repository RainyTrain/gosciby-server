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
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { ConfigModule, ConfigService } from '@nestjs/config';
import redisConfig from './redis/redis.config';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    PrismaModule,
    ProfileModule,
    AdminModule,
    TokenModule,
    AccomodationModule,
    BookingModule,
    FeedbackModule,
    ScheduleModule.forRoot(),

    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, '..', 'static', 'avatars'),
    }),
    ConfigModule.forRoot({ load: [redisConfig], isGlobal: true }),
    // CacheModule.register({
    //   isGlobal: true,
    //   useFactory: () => ({
    //     store: redisStore,
    //   }),
    //   host: 'localhost',
    //   port: 6379,
    // }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async (config: ConfigService) => {
        const store = await redisStore({
          socket: {
            host: config.get('redis.host'),
            port: config.get('redis.port'),
          },
        });

        return { store };
      },

      inject: [ConfigService],
    }),
  ],
  controllers: [MainController],
  providers: [AdminService],
})
export class AppModule {}
