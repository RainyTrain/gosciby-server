import { Transform } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { AccomodationType } from './accomodation.dto';

type OrderBy = 'asc' | 'desc';

type Sort = 'price' | 'availableRooms' | 'name';

export class AccomodationFilterDto {
  @IsOptional()
  accomodationType?: AccomodationType;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  wifi?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  pets?: boolean;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => {
    return Number(value);
  })
  lowPrice?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => {
    return Number(value);
  })
  highPrice?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  availableRooms?: boolean;

  @IsOptional()
  query?: string;

  @IsOptional()
  sorKey?: Sort;

  @IsOptional()
  orderBy?: OrderBy;
}
