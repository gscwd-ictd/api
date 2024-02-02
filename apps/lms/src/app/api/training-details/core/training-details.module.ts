import { CrudModule } from '@gscwd-api/crud';
import { TrainingDetails } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { TrainingDetailsService } from './training-details.service';
import { TrainingDetailsController } from './training-details.controller';
import { TrainingTagsModule } from '../components/training-tags';
import { TrainingDistributionsModule } from '../components/training-distributions';
import { TrainingRecommendedEmployeesModule } from '../components/training-recommended-employees';
import { LspDetailsModule } from '../../lsp-details';
import { PortalEmployeesModule } from '../../../services/portal';
import { TrainingLspDetailsModule } from '../components/training-lsp-details';
import { TrainingApprovalsModule } from '../components/training-approvals';

@Module({
  imports: [
    CrudModule.register(TrainingDetails),
    TrainingLspDetailsModule,
    TrainingTagsModule,
    TrainingDistributionsModule,
    TrainingRecommendedEmployeesModule,
    TrainingApprovalsModule,
    LspDetailsModule,
    PortalEmployeesModule,
  ],
  controllers: [TrainingDetailsController],
  providers: [TrainingDetailsService],
  exports: [TrainingDetailsService],
})
export class TrainingDetailsModule {}
