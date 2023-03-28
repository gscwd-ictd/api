import { Module } from '@nestjs/common';
import { DetailsController } from './details.controller';
import { DetailsService } from './details.service';
import { ItemsMicroserviceClientModule } from '@gscwd-api/microservices';

@Module({
  imports: [ItemsMicroserviceClientModule],
  controllers: [DetailsController],
  providers: [DetailsService],
})
export class DetailsModule {}
