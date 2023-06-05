import { Module } from '@nestjs/common';
import { EmployeeRestDayService } from './employee-rest-day.service';
import { EmployeeRestDayController } from './employee-rest-day.controller';
import { CrudModule } from '@gscwd-api/crud';
import { EmployeeRestDay } from '@gscwd-api/models';
import { EmployeeRestDaysModule } from '../components/employee-rest-days/core/employee-rest-days.module';

@Module({
  imports: [CrudModule.register(EmployeeRestDay), EmployeeRestDaysModule],
  providers: [EmployeeRestDayService],
  controllers: [EmployeeRestDayController],
  exports: [EmployeeRestDayService],
})
export class EmployeeRestDayModule {}
