import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  PLN = 'PLN',
  RUB = 'RUB',
}

export class ProfileDto {
  @Length(3, 15)
  name: string;

  @Length(3, 15)
  surname: string;

  @IsDate()
  @Transform(({ value }) => {
    return new Date(value).toISOString();
  })
  birth: string;

  @IsEnum(Currency)
  currency: Currency;

  @IsString()
  adress: string;

  @IsString()
  country: string;

  @IsOptional()
  avatar?: string;

  @IsInt()
  @Min(1)
  userId: number;
}
