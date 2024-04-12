import { Module } from '@nestjs/common';
import { AccomodationService } from './accomodation.service';
import { AccomodationController } from './accomodation.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [AccomodationService],
  controllers: [AccomodationController],
  imports: [PrismaModule, AuthModule],
})
export class AccomodationModule {}
