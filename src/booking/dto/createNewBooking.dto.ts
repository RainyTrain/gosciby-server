import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  Min,
} from 'class-validator';

type Status = 'ACTIVE' | 'INACTIVE';

export class CreateNewBooking {
  @IsInt()
  @Min(1)
  profileId: number;

  @IsInt()
  @Min(1)
  accomodationId: number;

  @IsDateString()
  @Transform(({ value }) => {
    return new Date(value).toISOString();
  })
  checkInDate: string;

  @IsDateString()
  @Transform(({ value }) => {
    return new Date(value).toISOString();
  })
  checkOutDate: string;

  @IsInt()
  @Min(0)
  totalPrice: number;

  @IsBoolean()
  isConfirmed: boolean;

  @IsOptional()
  @IsInt()
  rating?: number;

  status: Status;
}
