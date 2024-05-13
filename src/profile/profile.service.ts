import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProfileDto } from './dto/profile.dto';
import { ProfileUpdateDto } from './dto/profileUpdate.dto';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async getProfileInfo(id: number) {
    const profile = await this.prisma.profile.findUnique({ where: { id: id } });

    if (!profile) {
      throw NotFoundException;
    }

    return profile;
  }

  async getProfileInfoWithUser(id: number) {
    const profile = await this.prisma.profile.findUnique({
      where: { id: id },
      include: { user: true },
    });

    if (!profile) {
      throw NotFoundException;
    }

    return profile;
  }

  async updateProfile(id: number, dto: ProfileUpdateDto) {
    const profile = await this.prisma.profile.update({
      where: { id: id },
      data: { ...dto },
    });

    if (!profile) {
      throw NotFoundException;
    }

    return profile;
  }

  async createNewProfile(dto: ProfileDto) {
    console.log('dto', dto);
    const profile = await this.prisma.profile.create({ data: { ...dto } });

    if (!profile) {
      throw NotFoundException;
    }

    return profile;
  }

  async deleteProfile(id: number) {
    const profile = await this.prisma.profile.delete({ where: { id: id } });

    if (!profile) {
      throw NotFoundException;
    }

    return profile;
  }

  async uploadAvatar(id: number, avatar: Express.Multer.File) {
    console.log('huuy');
    const newFileName = uuidv4() + '.jpg';
    const staticPath = path.resolve(__dirname, '..', '..', 'static', 'avatars');
    try {
      const profile = await this.prisma.profile.findFirst({
        where: { id: id },
      });

      if (!profile) {
        throw new Error();
      }

      if (avatar.mimetype !== 'image/jpeg' && avatar.mimetype !== 'image/png') {
        throw new Error();
      }

      await this.prisma.profile.update({
        where: { id: id },
        data: { ...profile, avatar: newFileName } as ProfileUpdateDto,
      });

      await fs.writeFileSync(path.join(staticPath, newFileName), avatar.buffer);

      return 'Success!';
    } catch (error) {
      throw new HttpException('Error while uploading file', 400);
    }
  }
}
