import { Module } from '@nestjs/common';
import { EmployeeRestDaysService } from './employee-rest-days.service';
import { EmployeeRestDaysController } from './employee-rest-days.controller';
import { CrudModule } from '@gscwd-api/crud';
import { EmployeeRestDays } from '@gscwd-api/models';

@Module({
  imports: [CrudModule.register(EmployeeRestDays)],
  providers: [EmployeeRestDaysService],
  controllers: [EmployeeRestDaysController],
  exports: [EmployeeRestDaysService],
})
export class EmployeeRestDaysModule {}
