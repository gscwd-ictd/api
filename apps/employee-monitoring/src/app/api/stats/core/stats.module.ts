import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { PassSlipModule } from '../../pass-slip/core/pass-slip.module';
import { EmployeesModule } from '../../employees/core/employees.module';

@Module({
  imports: [PassSlipModule, EmployeesModule],
  providers: [StatsService],
  controllers: [StatsController],
})
export class StatsModule {}
