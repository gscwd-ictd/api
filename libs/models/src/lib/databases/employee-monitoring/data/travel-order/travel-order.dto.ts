import { PartialType } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsDateString, IsString, IsUUID } from 'class-validator';
import { TravelOrderItineraryDto } from '../travel-order-itinerary';

export class TravelOrderDto {
  @IsString()
  employeeId: string;

  @IsString({ message: 'Please specify purpose of travel' })
  purposeOfTravel: string;

  @IsDateString()
  dateRequested: Date;

  @IsDateString()
  travelOrderNo: string;

  @IsBoolean()
  isPtrRequired: boolean;

  @IsArray()
  itinerary: TravelOrderItineraryDto[];
}

export class UpdateTravelOrderDto extends PartialType(TravelOrderDto) {
  @IsUUID()
  id: string;
}
