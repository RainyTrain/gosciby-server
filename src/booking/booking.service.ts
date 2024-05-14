/* eslint-disable @typescript-eslint/ban-ts-comment */
import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNewBooking } from './dto/createNewBookingDto.dto';

@Injectable()
export class BookingService {
  constructor(private prismaService: PrismaService) {}

  async getAllBookings() {
    try {
      const bookings = this.prismaService.booking.findMany();

      if (!bookings) {
        throw new Error();
      }
    } catch (error) {
      throw new HttpException('Error while getting bookings', 400);
    }
  }

  async getBookingById(id: number) {
    try {
      const booking = this.prismaService.booking.findMany({
        where: { id: id },
      });

      if (!booking) {
        throw new Error();
      }
    } catch (error) {
      throw new HttpException('Booking not found', 404);
    }
  }

  async createNewBooking(dto: CreateNewBooking) {
    try {
      const { accomodationId, profileId } = dto;

      const booking = await this.prismaService.booking.findFirst({
        where: {
          accomodationId: accomodationId,
          profileId: profileId,
          isConfirmed: false,
        },
      });

      const profile = await this.prismaService.profile.findUnique({
        where: { id: profileId },
        select: { id: true, name: true },
      });

      const accomodation = await this.prismaService.accomodation.findUnique({
        where: { id: accomodationId },
        select: { id: true, price: true },
      });

      if ((!profile && !accomodation) || booking) {
        throw new Error();
      }

      console.log('doshel', profile, booking, accomodation);
      const newBooking = await this.prismaService.booking
        .create({
          //@ts-ignore
          data: { ...dto },
        })
        .catch((reason) => console.log(reason, 'reason'));

      return newBooking;
    } catch (error) {
      throw new HttpException('Booking already exists', 400);
    }
  }

  async updateBooking(id: number, dto: Partial<CreateNewBooking>) {
    try {
      const booking = this.prismaService.booking.findUnique({
        where: { id: id },
      });

      if (!booking) {
        throw new Error();
      }

      const updatedBooking = this.prismaService.booking.update({
        where: { id: id },
        data: { ...dto },
      });

      return updatedBooking;
    } catch (error) {
      throw new HttpException('Booking not found', 404);
    }
  }

  async deleteBooking(id: number) {
    try {
      const deletedBooking = this.prismaService.booking.delete({
        where: { id: id },
      });

      if (!deletedBooking) {
        throw new Error();
      }

      return deletedBooking;
    } catch (error) {
      throw new HttpException('Booking not found', 404);
    }
  }
}
