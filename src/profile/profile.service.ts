import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProfileDto } from './dto/profileDto';
import { ProfileUpdateDto } from './dto/profileUpdateDto';

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
}
