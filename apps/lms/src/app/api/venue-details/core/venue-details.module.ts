import { CrudModule } from '@gscwd-api/crud';
import { VenueDetails } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { VenueDetailsService } from './venue-details.service';
import { VenueDetailsController } from './venue-details.controller';
import { VenueFacilitiesModule } from '../components/venue-facilities';

@Module({
  imports: [CrudModule.register(VenueDetails), VenueFacilitiesModule],
  controllers: [VenueDetailsController],
  providers: [VenueDetailsService],
  exports: [VenueDetailsService],
})
export class VenueDetailsModule {}
