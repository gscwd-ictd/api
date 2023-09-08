import { Module } from '@nestjs/common';
import { OvertimeApplicationService } from './overtime-application.service';
import { OvertimeApplicationController } from './overtime-application.controller';
import { CrudModule } from '@gscwd-api/crud';
import { OvertimeApplication } from '@gscwd-api/models';

@Module({
  imports: [CrudModule.register(OvertimeApplication)],
  providers: [OvertimeApplicationService],
  controllers: [OvertimeApplicationController],
  exports: [OvertimeApplicationService],
})
export class OvertimeApplicationModule {}
