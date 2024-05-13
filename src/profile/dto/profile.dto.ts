import { IsInt, Length, Min } from 'class-validator';

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  PLN = 'PLN',
  RUB = 'RUB',
}

export class ProfileDto {
  @Length(5, 15)
  name: string;

  @Length(5, 15)
  surname: string;

  // create custom decorater to ensure proper date
  birth: string;

  currency: Currency;

  adress: string;

  country: string;

  avatar?: string;

  @IsInt()
  @Min(1)
  userId: number;
}
