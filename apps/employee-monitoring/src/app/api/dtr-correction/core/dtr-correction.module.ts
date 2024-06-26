import { Module, forwardRef } from '@nestjs/common';
import { DtrCorrectionService } from './dtr-correction.service';
import { DtrCorrectionController } from './dtr-correction.controller';
import { CrudModule } from '@gscwd-api/crud';
import { DtrCorrection } from '@gscwd-api/models';
import { EmployeesModule } from '../../employees/core/employees.module';
import { DailyTimeRecordModule } from '../../daily-time-record/core/daily-time-record.module';
import { DtrCorrectionMsController } from './dtr-correction-ms.controller';

@Module({
  imports: [CrudModule.register(DtrCorrection), EmployeesModule, DailyTimeRecordModule],
  providers: [DtrCorrectionService],
  controllers: [DtrCorrectionController, DtrCorrectionMsController],
  exports: [DtrCorrectionService],
})
export class DtrCorrectionModule {}
