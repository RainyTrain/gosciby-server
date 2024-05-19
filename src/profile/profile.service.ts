import {
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProfileDto } from './dto/profile.dto';
import { ProfileUpdateDto } from './dto/profileUpdate.dto';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';
import { Request } from 'express';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ProfileService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private prismaService: PrismaService,
  ) {}

  async getProfileInfo(req: Request, id: number) {
    try {
      //@ts-ignore
      const { id: userId } = req.user!;

      type PrismaProfileType = typeof this.prismaService.profile.fields;

      const cachedProfile = await this.cacheManager.get<PrismaProfileType>(
        `${userId}/profile`,
      );

      if (cachedProfile && Number(cachedProfile.id) === id) {
        return cachedProfile;
      }

      const profile = await this.prismaService.profile.findUnique({
        where: { id: id },
      });

      if (!profile) {
        throw new Error();
      }

      await this.cacheManager.set(`${userId}/profile`, profile, 1000 * 60 * 10);

      return profile;
    } catch (error) {
      throw new HttpException('Profile not found', 404);
    }
  }

  async getProfileInfoWithUser(id: number) {
    try {
      const profile = await this.prismaService.profile.findUnique({
        where: { id: id },
        include: { user: true },
      });

      if (!profile) {
        throw new Error();
      }

      return profile;
    } catch (error) {
      throw new HttpException('Profile not found', 404);
    }
  }

  async updateProfile(id: number, dto: ProfileUpdateDto) {
    try {
      const profile = await this.prismaService.profile.update({
        where: { id: id },
        data: { ...dto },
      });

      if (!profile) {
        throw new Error();
      }

      return profile;
    } catch (error) {
      throw new HttpException('Profile not found', 404);
    }
  }

  async createNewProfile(dto: ProfileDto) {
    try {
      const profile = await this.prismaService.profile.create({
        data: { ...dto },
      });

      if (!profile) {
        throw NotFoundException;
      }

      return profile;
    } catch (error) {
      throw new HttpException('Error with profile creating', 401);
    }
  }

  async deleteProfile(id: number) {
    try {
      const profile = await this.prismaService.profile.delete({
        where: { id: id },
      });

      if (!profile) {
        throw NotFoundException;
      }

      return profile;
    } catch (error) {
      throw new HttpException('Error with profile delition', 404);
    }
  }

  async uploadAvatar(id: number, avatar: Express.Multer.File) {
    const newFileName = uuidv4() + '.jpg';
    const staticPath = path.resolve(__dirname, '..', '..', 'static', 'avatars');
    try {
      const profile = await this.prismaService.profile.findFirst({
        where: { id: id },
      });

      if (!profile) {
        throw new Error();
      }

      if (avatar.mimetype !== 'image/jpeg' && avatar.mimetype !== 'image/png') {
        throw new Error();
      }

      const updatedProfile = await this.prismaService.profile.update({
        where: { id: id },
        data: { ...profile, avatar: newFileName } as ProfileUpdateDto,
      });

      if (!updatedProfile) {
        throw new Error();
      }

      await fs.writeFileSync(path.join(staticPath, newFileName), avatar.buffer);

      return updatedProfile;
    } catch (error) {
      throw new HttpException('Error while uploading file', 400);
    }
  }
}
