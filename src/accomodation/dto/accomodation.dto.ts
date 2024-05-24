import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { IsAvailableRoomsValid } from 'src/decorators/isAvailableRoomsValid';

export enum AccomodationType {
  HOTEL = 'HOTEL',
  APARTMENT = 'APARTMENT',
  HOSTEL = 'HOSTEL',
  HOUSE = 'HOUSE',
  VILLA = 'VILLA',
}

export class AccomodationDto {
  @IsEnum(AccomodationType)
  accomodationType: AccomodationType;

  @IsString()
  @Length(3, 15)
  name: string;

  @IsString()
  description: string;

  @IsInt()
  @Min(1)
  totalRooms: number;

  @IsInt()
  @Min(0)
  @IsAvailableRoomsValid('totalRooms', {
    message: 'invalid amount of available rooms',
  })
  availableRooms: number;

  @IsBoolean()
  wifi: boolean;

  @IsBoolean()
  pets: boolean;

  @IsInt()
  @Min(0)
  price: number;

  @IsInt()
  @Min(1)
  ownerId: number;

  @IsOptional()
  coordinates?: string;

  @IsArray()
  photos: Array<string>;
}
