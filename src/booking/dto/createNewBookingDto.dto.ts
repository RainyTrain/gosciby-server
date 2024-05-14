export class CreateNewBooking {
  profileId: number;
  accomodationId: number;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  isConfirmed: boolean;
  rating?: number;
}
