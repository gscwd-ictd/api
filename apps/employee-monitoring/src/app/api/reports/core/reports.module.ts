import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { EmployeesModule } from '../../employees/core/employees.module';
import { DailyTimeRecord } from '@gscwd-api/models';

@Module({
  imports: [EmployeesModule, DailyTimeRecord],
  providers: [ReportsService],
  controllers: [ReportsController],
})
export class ReportsModule {}
