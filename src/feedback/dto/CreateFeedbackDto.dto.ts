export class CreateFeedbackDto {
  profileId: number;
  bookingId: number;
  content: string;
  stars: number = 0;
}
