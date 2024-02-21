import { Module } from '@nestjs/common';
import { OfficerOfTheDayService } from './officer-of-the-day.service';
import { OfficerOfTheDayController } from './officer-of-the-day.controller';
import { CrudModule } from '@gscwd-api/crud';
import { OfficerOfTheDay } from '@gscwd-api/models';
import { EmployeesModule } from '../../employees/core/employees.module';

@Module({
  imports: [CrudModule.register(OfficerOfTheDay), EmployeesModule],
  providers: [OfficerOfTheDayService],
  controllers: [OfficerOfTheDayController],
  exports: [OfficerOfTheDayService],
})
export class OfficerOfTheDayModule {}
