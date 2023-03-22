import { Module } from '@nestjs/common';
import { UnitOfMeasureService } from './unit-of-measure.service';
import { UnitOfMeasureController } from './unit-of-measure.controller';
import { ItemsMicroserviceClientModule } from '@gscwd-api/microservices';

@Module({
  imports: [ItemsMicroserviceClientModule],
  providers: [UnitOfMeasureService],
  controllers: [UnitOfMeasureController],
})
export class UnitOfMeasureModule {}
