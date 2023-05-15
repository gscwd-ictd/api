import { Module } from '@nestjs/common';
import { TravelOrderItineraryService } from './travel-order-itinerary.service';
import { TravelOrderItineraryController } from './travel-order-itinerary.controller';
import { CrudModule } from '@gscwd-api/crud';
import { TravelOrderItinerary } from '@gscwd-api/models';

@Module({
  imports: [CrudModule.register(TravelOrderItinerary)],
  providers: [TravelOrderItineraryService],
  controllers: [TravelOrderItineraryController],
  exports: [TravelOrderItineraryService],
})
export class TravelOrderItineraryModule {}
