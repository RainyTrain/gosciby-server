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
import { CreateFeedbackDto } from './dto/CreateFeedbackDto.dto';
import { FeedbackService } from './feedback.service';

@Controller('feedback')
export class FeedbackController {
  constructor(private feedbackService: FeedbackService) {}

  @Get()
  async getAllFeedbacks() {
    return this.feedbackService.getAllFeedbacks();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getFeedbacksForAccomodationId(@Param('id') id: number) {
    return this.feedbackService.getFeedbacksForAccomodationId(Number(id));
  }

  @UseGuards(AuthGuard)
  @Post('create')
  async createNewFeedback(@Body() dto: CreateFeedbackDto) {
    return this.feedbackService.createNewFeedback(dto);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async editFeedbackById(
    @Param('id') id: number,
    @Body() dto: Partial<CreateFeedbackDto>,
  ) {
    return this.feedbackService.editFeedbackById(Number(id), dto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteFeedbackById(@Param('id') id: number) {
    return this.feedbackService.deleteFeedbackById(Number(id));
  }
}
