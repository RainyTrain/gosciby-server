import { IsInt, IsString, Max, Min } from 'class-validator';

export class CreateFeedbackDto {
  @IsInt()
  profileId: number;

  @IsInt()
  bookingId: number;

  @IsString()
  content: string;

  @IsInt()
  @Min(0)
  @Max(5)
  stars: number = 0;
}
