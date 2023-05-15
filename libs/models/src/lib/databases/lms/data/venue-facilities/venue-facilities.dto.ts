import { PartialType } from '@nestjs/swagger';
import { IsNumber, IsString, IsUUID, Length } from 'class-validator';
import { VenueDetails } from '../venue-details';

export class CreateVenueFacilityDto {
  @IsString({ message: 'venue facility name must be a string' })
  @Length(1, 100, { message: 'venue facility name must be between 1 to 100 characters' })
  name: string;

  @IsUUID()
  venueDetails: VenueDetails;

  @IsNumber({ maxDecimalPlaces: 2 })
  cost: number;

  @IsNumber()
  maximumPax: number;
}

export class UpdateVenueFacilityDto extends PartialType(CreateVenueFacilityDto) {}
