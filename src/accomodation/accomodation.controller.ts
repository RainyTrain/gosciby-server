import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { AccomodationService } from './accomodation.service';
import { AccomodationDto } from './dto/accomodation.dto';
import { AccomodationFilterDto } from './dto/accomodationFilter.dto';

@Controller('accomodation')
export class AccomodationController {
  constructor(private accomodationService: AccomodationService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getAllAccomodations(
    @Req() req: Request,
    @Query(
      new ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
      }),
    )
    query: AccomodationFilterDto,
  ) {
    return this.accomodationService.getAllAccomodations(req, query);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getAccomodationById(
    @Param('id', new ParseIntPipe()) id: number,
    @Req() req: Request,
  ) {
    return this.accomodationService.getAccomodationById(req, id);
  }

  @UseGuards(AuthGuard)
  @Post('create')
  async createAccomodation(@Body() dto: AccomodationDto) {
    return this.accomodationService.createAccomodation(dto);
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('file'))
  @Post(':id/photos')
  async uploadAvatar(
    @Param('id', new ParseIntPipe()) id: number,
    @UploadedFiles() photos: Array<Express.Multer.File>,
  ) {
    return await this.accomodationService.uploadAccomodationPhoto(id, photos);
  }

  @UseGuards(AuthGuard)
  @Patch(':id/update')
  async updateAccomodation(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() dto: AccomodationDto,
  ) {
    return this.accomodationService.editAccomodation(id, dto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id/delete')
  async deleteAccomodation(@Param('id', new ParseIntPipe()) id: number) {
    return this.accomodationService.deleteAccomodation(id);
  }
}
