import { CrudModule } from '@gscwd-api/crud';
import { TrainingApproval } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { TrainingApprovalsService } from './training-approvals.service';
import { TrainingNomineesModule } from '../../nominees';

@Module({
  imports: [CrudModule.register(TrainingApproval), TrainingNomineesModule],
  controllers: [],
  providers: [TrainingApprovalsService],
  exports: [TrainingApprovalsService],
})
export class TrainingApprovalsModule {}
