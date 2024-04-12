import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AccomodationDto } from './dto/accomodation.dto';

@Injectable()
export class AccomodationService {
  constructor(private prismaService: PrismaService) {}

  async getAllAccomodations() {
    const accomodations = await this.prismaService.accomodation.findMany();

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
}
