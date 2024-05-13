import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AccomodationDto } from './dto/accomodation.dto';
import { AccomodationFilterDto } from './dto/accomodationFilterDto.dto';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';
import { AccomodationUpdate } from './dto/accomodationUpdateDto.dto';

@Injectable()
export class AccomodationService {
  constructor(private prismaService: PrismaService) {}

  async getAllAccomodations(dto?: AccomodationFilterDto) {
    const accomodations = await this.prismaService.accomodation.findMany(
      dto && {
        where: {
          pets: {
            equals: dto.pets ?? undefined,
          },
          wifi: {
            equals: dto.wifi ?? undefined,
          },
          accomodationType: { equals: dto.accomodationType ?? undefined },
          availableRooms: { gt: dto.availableRooms ? 0 : undefined },
          name: { contains: dto.query ?? undefined },
          AND: [
            { price: { gte: dto.lowPrice } },
            { price: { lte: dto.highPrice } },
          ],
        },
        orderBy: [
          { name: dto.sorKey == 'name' ? dto.orderBy : undefined },
          {
            availableRooms:
              dto.sorKey == 'availableRooms' ? dto.orderBy : undefined,
          },
          { price: dto.sorKey == 'price' ? dto.orderBy : undefined },
        ],
      },
    );

    return accomodations;
  }

  async getAccomodationById(id: number) {
    const accomodation = await this.prismaService.accomodation.findFirst({
      where: { id: id },
    });

    if (!accomodation) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    return accomodation;
  }

  async createAccomodation(dto: AccomodationDto) {
    const newAccomodation = this.prismaService.accomodation.create({
      data: dto,
    });

    if (!newAccomodation) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return newAccomodation;
  }

  async editAccomodation(id: number, dto: Partial<AccomodationDto>) {
    const updatedAccomodation = this.prismaService.accomodation.update({
      where: { id: id },
      data: { ...dto },
    });

    if (!updatedAccomodation) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return updatedAccomodation;
  }

  async deleteAccomodation(id: number) {
    const deletedAccomodation = this.prismaService.accomodation.delete({
      where: { id: id },
    });

    if (!deletedAccomodation) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    return deletedAccomodation;
  }

  async uploadAccomodationPhoto(
    id: number,
    photos: Array<Express.Multer.File>,
  ) {
    const staticPath = path.resolve(__dirname, '..', '..', 'static', 'avatars');

    const newPhotos: Array<string> = [];

    try {
      const accomodation = await this.prismaService.accomodation.findFirst({
        where: { id: id },
      });

      if (!accomodation) {
        throw new Error();
      }

      photos.forEach(async (photo) => {
        if (photo.mimetype !== 'image/jpeg' && photo.mimetype !== 'image/png') {
          throw new Error();
        }

        const newFileName = uuidv4() + '.jpg';

        newPhotos.push(newFileName);

        await fs.writeFileSync(
          path.join(staticPath, newFileName),
          photo.buffer,
        );
      });

      await this.prismaService.accomodation.update({
        where: { id: id },
        data: {
          ...accomodation,
          photos: [...accomodation.photos, ...newPhotos],
        } as AccomodationUpdate,
      });

      return 'Success!';
    } catch (error) {
      throw new HttpException('Error while uploading file', 400);
    }
  }
}
