import { CrudModule } from '@gscwd-api/crud';
import { TrainingApproval } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { TrainingApprovalsService } from './training-approvals.service';
import { TrainingApprovalsController } from './training-approvals.controller';
import { TrainingDetailsModule } from '../../../core/training-details.module';
import { TrainingApprovalsMicroserviceController } from './training-approvals-ms.controller';

@Module({
  imports: [CrudModule.register(TrainingApproval), TrainingDetailsModule],
  controllers: [TrainingApprovalsController, TrainingApprovalsMicroserviceController],
  providers: [TrainingApprovalsService],
  exports: [TrainingApprovalsService],
})
export class TrainingApprovalsModule {}
