import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { PassSlipModule } from '../../pass-slip/core/pass-slip.module';
import { EmployeesModule } from '../../employees/core/employees.module';
import { OrganizationModule } from '../../organization/core/organization.module';
import { StatsMsController } from './stats-ms.controller';

@Module({
  imports: [PassSlipModule, EmployeesModule, OrganizationModule],
  providers: [StatsService],
  controllers: [StatsController, StatsMsController],
})
export class StatsModule {}
