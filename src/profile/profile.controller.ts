import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
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
    @Param('id', new ParseIntPipe()) id: number,
    @Body() profileDto: ProfileUpdateDto,
  ) {
    return this.profileService.updateProfile(id, profileDto);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getProfile(
    @Req() req: Request,
    @Param('id', new ParseIntPipe()) id: number,
  ) {
    return this.profileService.getProfileInfo(req, id);
  }

  @UseGuards(AuthGuard)
  @Get('full/:id')
  async getFullProfile(@Param('id', new ParseIntPipe()) id: number) {
    return this.profileService.getProfileInfoWithUser(id);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteProfile(@Param('id', new ParseIntPipe()) id: number) {
    return this.profileService.deleteProfile(id);
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post(':id/avatar')
  async uploadAvatar(
    @Param('id', new ParseIntPipe()) id: number,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    return await this.profileService.uploadAvatar(id, avatar);
  }
}
