import { SmsMicroserviceClientModule } from '@gscwd-api/microservices';
import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';

@Module({
  imports: [SmsMicroserviceClientModule],
  controllers: [],
  providers: [SmsService],
  exports: [SmsService],
})
export class SmsModule {}
