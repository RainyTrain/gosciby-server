import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AccomodationDto } from './dto/accomodation.dto';
import { AccomodationFilterDto } from './dto/accomodationFilterDto.dto';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';
import { AccomodationUpdate } from './dto/accomodationUpdateDto.dto';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Request } from 'express';

@Injectable()
export class AccomodationService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private prismaService: PrismaService,
  ) {}

  async getAllAccomodations(req: Request, dto: AccomodationFilterDto) {
    try {
      //@ts-ignore
      const { id: userId } = req.user!;

      const cachedData =
        Object.keys(dto).length == 0 &&
        (await this.cacheManager.get(`${userId}/accomodations`));

      if (cachedData) {
        return cachedData;
      }

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

      if (!accomodations) {
        throw new Error();
      }

      Object.keys(dto).length == 0 &&
        (await this.cacheManager.set(
          `${userId}/accomodations`,
          accomodations,
          1000 * 60 * 10,
        ));

      return accomodations;
    } catch (error) {
      throw new HttpException('Accomodations not found', 404);
    }
  }

  async getAccomodationById(req: Request, id: number) {
    try {
      //@ts-ignore
      const { id: userId } = req.user!;

      const cachedAccomodation = await this.cacheManager.get(
        `${userId}/accomodation`,
      );

      if (cachedAccomodation) {
        return cachedAccomodation;
      }

      const accomodation = await this.prismaService.accomodation.findFirst({
        where: { id: id },
      });

      if (!accomodation) {
        throw new Error();
      }

      await this.cacheManager.set(
        `${userId}/accomodation`,
        accomodation,
        1000 * 60 * 10,
      );

      return accomodation;
    } catch (error) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  async createAccomodation(dto: AccomodationDto) {
    try {
      const newAccomodation = this.prismaService.accomodation.create({
        data: dto,
      });

      if (!newAccomodation) {
        throw new Error();
      }

      return newAccomodation;
    } catch (error) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }

  async editAccomodation(id: number, dto: Partial<AccomodationDto>) {
    try {
      const updatedAccomodation = this.prismaService.accomodation.update({
        where: { id: id },
        data: { ...dto },
      });

      if (!updatedAccomodation) {
        throw new Error();
      }

      return updatedAccomodation;
    } catch (error) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }

  async deleteAccomodation(id: number) {
    try {
      const deletedAccomodation = this.prismaService.accomodation.delete({
        where: { id: id },
      });

      if (!deletedAccomodation) {
        throw new Error();
      }

      return deletedAccomodation;
    } catch (error) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
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
