import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { TrainingDetailsModule } from '../../training';
import { HrmsEmployeesModule } from '../../../services/hrms';

@Module({
  imports: [TrainingDetailsModule, HrmsEmployeesModule],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
