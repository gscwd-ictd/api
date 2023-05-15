import { CrudModule } from '@gscwd-api/crud';
import { VenueDetails } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { VenueDetailsService } from './venue-details.service';
import { VenueDetailsController } from './venue-details.controller';

@Module({
  imports: [CrudModule.register(VenueDetails)],
  controllers: [VenueDetailsController],
  providers: [VenueDetailsService],
  exports: [VenueDetailsService],
})
export class VenueDetailsModule {}
