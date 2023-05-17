import { CrudModule } from '@gscwd-api/crud';
import { VenueFacility } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { VenueFacilitiesService } from './venue-facilities.service';
import { VenueFacilitiesController } from './venue-facilities.controller';

@Module({
  imports: [CrudModule.register(VenueFacility)],
  controllers: [VenueFacilitiesController],
  providers: [VenueFacilitiesService],
  exports: [VenueFacilitiesService],
})
export class VenueFacilitiesModule {}
