import { Module } from '@nestjs/common';
import { EmployeeRestDayService } from './employee-rest-day.service';
import { EmployeeRestDayController } from './employee-rest-day.controller';

@Module({
  providers: [EmployeeRestDayService],
  controllers: [EmployeeRestDayController]
})
export class EmployeeRestDayModule {}
