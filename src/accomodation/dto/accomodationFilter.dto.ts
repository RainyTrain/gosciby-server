import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsOptional } from 'class-validator';
import { AccomodationType } from './accomodation.dto';

enum OrderBy {
  ASC = 'asc',
  DESC = 'desc',
}

enum Sort {
  PRICE = 'price',
  AVAILABLE_ROOMS = 'availableRooms',
  NAME = 'name',
}

export class AccomodationFilterDto {
  @IsOptional()
  @IsEnum(AccomodationType)
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
  @IsInt()
  @Transform(({ value }) => {
    return Number(value);
  })
  lowPrice?: number;

  @IsOptional()
  @IsInt()
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
  @IsEnum(Sort)
  sorKey?: Sort = Sort.PRICE;

  @IsOptional()
  @IsEnum(OrderBy)
  orderBy?: OrderBy = OrderBy.ASC;

  @IsInt()
  @Transform(({ value }) => {
    return Number(value);
  })
  limit: number;

  @IsInt()
  @Transform(({ value }) => {
    return Number(value);
  })
  page: number;
}
