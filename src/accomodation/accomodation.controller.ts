import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { AccomodationService } from './accomodation.service';
import { AccomodationDto } from './dto/accomodation.dto';

@Controller('accomodation')
export class AccomodationController {
  constructor(private accomodationService: AccomodationService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getAllAccomodations() {
    return this.accomodationService.getAllAccomodations();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getAccomodationById(@Param('id') id: number) {
    return this.accomodationService.getAccomodationById(Number(id));
  }

  @UseGuards(AuthGuard)
  @Post('create')
  async createAccomodation(@Body() dto: AccomodationDto) {
    return this.accomodationService.createAccomodation(dto);
  }

  @UseGuards(AuthGuard)
  @Patch(':id/update')
  async updateAccomodation(
    @Param('id') id: number,
    @Body() dto: AccomodationDto,
  ) {
    return this.accomodationService.editAccomodation(Number(id), dto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id/delete')
  async deleteAccomodation(@Param('id') id: number) {
    return this.accomodationService.deleteAccomodation(Number(id));
  }
}
