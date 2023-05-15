import { TravelOrder } from '@gscwd-api/models';

export class TravelOrderItineraryDto {
  travelOrderId?: TravelOrder;
  scheduleDate: Date;
  schedulePlace: string;
}
