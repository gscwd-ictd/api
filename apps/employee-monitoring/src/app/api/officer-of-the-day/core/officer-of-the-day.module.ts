import { Module } from '@nestjs/common';
import { OfficerOfTheDayService } from './officer-of-the-day.service';
import { OfficerOfTheDayController } from './officer-of-the-day.controller';
import { CrudModule } from '@gscwd-api/crud';
import { OfficerOfTheDay } from '@gscwd-api/models';
import { EmployeesModule } from '../../employees/core/employees.module';
import { OrganizationModule } from '../../organization/core/organization.module';
import { OfficerOfTheDayMsController } from './officer-of-the-day-ms.controller';

@Module({
  imports: [CrudModule.register(OfficerOfTheDay), EmployeesModule, OrganizationModule],
  providers: [OfficerOfTheDayService],
  controllers: [OfficerOfTheDayController, OfficerOfTheDayMsController],
  exports: [OfficerOfTheDayService],
})
export class OfficerOfTheDayModule {}
