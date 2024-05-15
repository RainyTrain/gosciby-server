import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateNewBooking } from './dto/createNewBookingDto.dto';

@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @Get()
  async getAllBookings() {
    return this.bookingService.getAllBookings();
  }

  @Get(':id')
  async getBookingById(@Param('id') id: number) {
    return this.bookingService.getBookingById(Number(id));
  }

  @Post('create')
  async createNewBooking(@Body() dto: CreateNewBooking) {
    return await this.bookingService.createNewBooking(dto as CreateNewBooking);
  }

  @Post('change-status')
  async changeBookingStatus() {
    return this.bookingService.changeBookingStatus();
  }

  @Patch(':id')
  async updateBooking(
    @Param('id') id: number,
    @Body() dto: Partial<CreateNewBooking>,
  ) {
    return this.bookingService.updateBooking(Number(id), dto);
  }

  @Delete(':id')
  async deleteBooking(@Param('id') id: number) {
    return this.bookingService.deleteBooking(Number(id));
  }
}
