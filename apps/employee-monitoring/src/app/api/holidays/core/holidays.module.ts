import { CrudModule } from '@gscwd-api/crud';
import { Holidays } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { LeaveAddBackModule } from '../../leave/components/leave-add-back/core/leave-add-back.module';
import { LeaveApplicationDatesModule } from '../../leave/components/leave-application-dates/core/leave-application-dates.module';
import { LeaveCardLedgerCreditModule } from '../../leave/components/leave-card-ledger-credit/core/leave-card-ledger-credit.module';
import { UserLogsService } from '../../user-logs/core/user-logs.service';
import { HolidaysMsController } from './holidays-ms.controller';
import { HolidaysController } from './holidays.controller';
import { HolidaysService } from './holidays.service';

@Module({
  imports: [CrudModule.register(Holidays), LeaveApplicationDatesModule, LeaveAddBackModule, LeaveCardLedgerCreditModule],
  providers: [HolidaysService, UserLogsService],
  controllers: [HolidaysController, HolidaysMsController],
  exports: [HolidaysService],
})
export class HolidaysModule {}
