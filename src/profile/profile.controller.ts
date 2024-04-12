import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';
import { ProfileDto } from './dto/profile.dto';
import { ProfileUpdateDto } from './dto/profileUpdate.dto';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  async createProfile(@Body() profileDto: ProfileDto) {
    return this.profileService.createNewProfile(profileDto);
  }

  @UseGuards(AuthGuard)
  @Patch('update/:id')
  async editProfile(
    @Param('id') id: number,
    @Body() profileDto: ProfileUpdateDto,
  ) {
    return this.profileService.updateProfile(Number(id), profileDto);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getProfile(@Param('id') id: string) {
    return this.profileService.getProfileInfo(Number(id));
  }

  @UseGuards(AuthGuard)
  @Get('full/:id')
  async getFullProfile(@Param('id') id: string) {
    return this.profileService.getProfileInfoWithUser(Number(id));
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteProfile(@Param('id') id: string) {
    return this.profileService.deleteProfile(Number(id));
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post(':id/avatar')
  async uploadAvatar(
    @Param('id') id: number,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    return this.profileService.uploadAvatar(Number(id), avatar);
  }
}
