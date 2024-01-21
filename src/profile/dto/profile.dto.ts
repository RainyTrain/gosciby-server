import { IsInt, Length, Min } from 'class-validator';

export class ProfileDto {
  @Length(5, 15)
  name: string;

  @Length(5, 15)
  surname: string;

  // create custom decorater to ensure proper date
  birth: string;

  adress: string;

  avatar: string;

  @IsInt()
  @Min(1)
  userId: number;
}
