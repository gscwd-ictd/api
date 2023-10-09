import { PartialType } from '@nestjs/swagger';
import { TravelOrderItineraryDto } from '../travel-order-itinerary';

export class TravelOrderDto {
  employeeId: string;
  purposeOfTravel: string;
  dateRequested: Date;
  travelOrderNo: string;
  isPtrRequired: boolean;
  itinerary: TravelOrderItineraryDto[];
}

export class UpdateTravelOrderDto extends PartialType(TravelOrderDto) {
  id: string;
}
