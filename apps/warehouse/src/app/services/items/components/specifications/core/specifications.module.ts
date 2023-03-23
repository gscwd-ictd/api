import { Module } from '@nestjs/common';
import { SpecificationsService } from './specifications.service';
import { SpecificationsController } from './specifications.controller';
import { ItemsMicroserviceClientModule } from '@gscwd-api/microservices';

@Module({
  imports: [ItemsMicroserviceClientModule],
  providers: [SpecificationsService],
  controllers: [SpecificationsController],
  exports: [SpecificationsService],
})
export class SpecificationsModule {}
