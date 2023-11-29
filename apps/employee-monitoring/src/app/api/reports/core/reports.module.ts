import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { EmployeesModule } from '../../employees/core/employees.module';
import { DailyTimeRecordModule } from '../../daily-time-record/core/daily-time-record.module';

@Module({
  imports: [EmployeesModule, DailyTimeRecordModule],
  providers: [ReportsService],
  controllers: [ReportsController],
})
export class ReportsModule {}
