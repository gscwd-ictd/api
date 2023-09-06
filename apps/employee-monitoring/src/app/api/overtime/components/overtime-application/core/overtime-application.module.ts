import { Module } from '@nestjs/common';
import { OvertimeApplicationService } from './overtime-application.service';
import { OvertimeApplicationController } from './overtime-application.controller';

@Module({
  providers: [OvertimeApplicationService],
  controllers: [OvertimeApplicationController]
})
export class OvertimeApplicationModule {}
