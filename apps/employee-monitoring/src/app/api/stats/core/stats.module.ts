import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { PassSlipModule } from '../../pass-slip/core/pass-slip.module';
import { EmployeesModule } from '../../employees/core/employees.module';
import { OrganizationModule } from '../../organization/core/organization.module';
import { StatsMsController } from './stats-ms.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { OvertimeModule } from '../../overtime/core/overtime.module';

@Module({
  imports: [CacheModule.register({ ttl: 43200000 }), PassSlipModule, EmployeesModule, OrganizationModule, OvertimeModule],
  providers: [StatsService],
  controllers: [StatsController, StatsMsController],
})
export class StatsModule {}
