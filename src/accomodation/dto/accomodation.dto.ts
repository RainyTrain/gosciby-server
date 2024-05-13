export enum AccomodationType {
  HOTEL = 'HOTEL',
  APARTMENT = 'APARTMENT',
  HOSTEL = 'HOSTEL',
  HOUSE = 'HOUSE',
  VILLA = 'VILLA',
}

export class AccomodationDto {
  accomodationType: AccomodationType;
  name: string;
  description: string;
  totalRooms: number;
  availableRooms: number;
  wifi: boolean;
  pets: boolean;
  price: number;
  ownerId: number;
  coordinates?: string;
  photos: Array<string>;
}
