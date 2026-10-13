import { CrudModule } from '@gscwd-api/crud';
import { TrainingApproval } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { TrainingApprovalsService } from './training-approvals.service';
import { TrainingNomineesModule } from '../../nominees';
import { HrmsEmployeesModule } from '../../../../../services/hrms';

@Module({
  imports: [CrudModule.register(TrainingApproval), TrainingNomineesModule, HrmsEmployeesModule],
  controllers: [],
  providers: [TrainingApprovalsService],
  exports: [TrainingApprovalsService],
})
export class TrainingApprovalsModule {}
