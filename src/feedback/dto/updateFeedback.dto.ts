import { PartialType } from '@nestjs/swagger';
import { CreateFeedbackDto } from './createFeedback.dto';

export class UpdateFeedback extends PartialType(CreateFeedbackDto) {}
