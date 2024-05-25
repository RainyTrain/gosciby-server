import { AccomodationDto } from './accomodation.dto';
import { PartialType } from '@nestjs/swagger';

export class AccomodationUpdate extends PartialType(AccomodationDto) {}
