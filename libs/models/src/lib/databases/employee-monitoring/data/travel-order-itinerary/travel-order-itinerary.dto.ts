import { TravelOrder } from '@gscwd-api/models';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class TravelOrderItineraryDto {
  @IsOptional()
  travelOrderId?: TravelOrder;

  @IsDateString()
  scheduleDate: Date;

  @IsString()
  schedulePlace: string;
}
