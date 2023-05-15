import { PartialType } from '@nestjs/swagger';
import { TravelOrderItineraryDto } from '../travel-order-itinerary';

export class TravelOrderDto {
  employee: { employeeId: string; fullName?: string };
  purposeOfTravel: string;
  dateRequested: Date;
  travelOrderNo: string;
  isPtrRequired: boolean;
  itinerary: TravelOrderItineraryDto[];
}

export class UpdateTravelOrderDto extends PartialType(TravelOrderDto) {
  id: string;
}
