import { CrudModule } from '@gscwd-api/crud';
import { TrainingApproval } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { TrainingApprovalsService } from './training-approvals.service';
import { TrainingApprovalsController } from './training-approvals.controller';

@Module({
  imports: [CrudModule.register(TrainingApproval)],
  controllers: [TrainingApprovalsController],
  providers: [TrainingApprovalsService],
  exports: [TrainingApprovalsService],
})
export class TrainingApprovalsModule {}
