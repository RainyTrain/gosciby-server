import { IsBoolean, IsDate, IsInt, IsOptional, Min } from 'class-validator';

export class CreateNewBooking {
  @IsInt()
  @Min(1)
  profileId: number;

  @IsInt()
  @Min(1)
  accomodationId: number;

  @IsDate()
  checkInDate: string;

  @IsDate()
  checkOutDate: string;

  @IsDate()
  @Min(0)
  totalPrice: number;

  @IsBoolean()
  isConfirmed: boolean;

  @IsOptional()
  @IsInt()
  rating?: number;
}
