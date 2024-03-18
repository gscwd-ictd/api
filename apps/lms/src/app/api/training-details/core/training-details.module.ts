import { CrudModule } from '@gscwd-api/crud';
import { TrainingDetails } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { TrainingDetailsService } from './training-details.service';
import { TrainingDetailsController } from './training-details.controller';
import { TrainingTagsModule } from '../../training/components/tags';
import { TrainingDistributionsModule } from '../../training/components/slot-distributions';
import { TrainingRecommendedEmployeesModule } from '../../training/components/recommended-employees';
import { LspDetailsModule } from '../../lsp-details';
import { PortalEmployeesModule } from '../../../services/portal';
import { TrainingLspDetailsModule } from '../../training/components/lsp';

@Module({
  imports: [
    CrudModule.register(TrainingDetails),
    TrainingLspDetailsModule,
    TrainingTagsModule,
    TrainingDistributionsModule,
    TrainingRecommendedEmployeesModule,
    LspDetailsModule,
    PortalEmployeesModule,
  ],
  controllers: [TrainingDetailsController],
  providers: [TrainingDetailsService],
  exports: [TrainingDetailsService],
})
export class TrainingDetailsModule {}
