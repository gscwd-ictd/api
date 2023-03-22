import { Module } from '@nestjs/common';
import { ClassificationsController } from './classifications.controller';
import { ClassificationsService } from './classifications.service';
import { ItemsMicroserviceClientModule } from '@gscwd-api/microservices';

@Module({
  imports: [ItemsMicroserviceClientModule],
  controllers: [ClassificationsController],
  providers: [ClassificationsService],
  exports: [ClassificationsService],
})
export class ClassificationsModule {}
