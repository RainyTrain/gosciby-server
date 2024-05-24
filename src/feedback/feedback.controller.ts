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
import { CreateFeedbackDto } from './dto/createFeedback.dto';
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
  async getFeedbacksForAccomodationId(
    @Param('id', new ParseIntPipe()) id: number,
  ) {
    return this.feedbackService.getFeedbacksForAccomodationId(id);
  }

  @UseGuards(AuthGuard)
  @Post('create')
  async createNewFeedback(
    @Body(
      new ValidationPipe({
        exceptionFactory: (errors) => showErrorFields(errors),
      }),
    )
    dto: CreateFeedbackDto,
  ) {
    return this.feedbackService.createNewFeedback(dto);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async editFeedbackById(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() dto: Partial<CreateFeedbackDto>,
  ) {
    return this.feedbackService.editFeedbackById(id, dto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteFeedbackById(@Param('id', new ParseIntPipe()) id: number) {
    return this.feedbackService.deleteFeedbackById(id);
  }
}
