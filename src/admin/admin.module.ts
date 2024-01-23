import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  providers: [AdminService],
  imports: [PrismaModule, AuthModule],
  controllers: [AdminController],
})
export class AdminModule {}
