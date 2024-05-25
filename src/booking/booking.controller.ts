import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { showErrorFields } from 'src/exceptions/showErrorFields';
import { BookingService } from './booking.service';
import { CreateNewBooking } from './dto/createNewBooking.dto';
import { UpdateBooking } from './dto/updateBooking.dto';

@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @Get()
  async getAllBookings() {
    return this.bookingService.getAllBookings();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getBookingById(@Param('id', new ParseIntPipe()) id: number) {
    return this.bookingService.getBookingById(id);
  }

  @UseGuards(AuthGuard)
  @Post('create')
  async createNewBooking(
    @Body(
      new ValidationPipe({
        exceptionFactory: (errors) => showErrorFields(errors),
      }),
    )
    dto: CreateNewBooking,
  ) {
    return await this.bookingService.createNewBooking(dto as CreateNewBooking);
  }

  @Post('change-status')
  async changeBookingStatus() {
    return this.bookingService.changeBookingStatus();
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateBooking(
    @Param('id', new ParseIntPipe()) id: number,
    @Body(
      new ValidationPipe({
        exceptionFactory: (errors) => showErrorFields(errors),
      }),
    )
    dto: UpdateBooking,
  ) {
    return this.bookingService.updateBooking(id, dto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteBooking(@Param('id', new ParseIntPipe()) id: number) {
    return this.bookingService.deleteBooking(id);
  }
}
