import { PartialType } from '@nestjs/swagger';
import { CreateNewBooking } from './createNewBooking.dto';

export class UpdateBooking extends PartialType(CreateNewBooking) {}
