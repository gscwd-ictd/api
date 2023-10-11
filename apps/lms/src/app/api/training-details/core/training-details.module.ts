import { CrudModule } from '@gscwd-api/crud';
import { TrainingDetails } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { TrainingDetailsService } from './training-details.service';
import { TrainingDetailsController } from './training-details.controller';
import { TrainingTagsModule } from '../components/training-tags';
import { TrainingDistributionsModule } from '../components/training-distributions';
import { TrainingRecommendedEmployeesModule } from '../components/training-recommended-employees';
import { LspDetailsModule } from '../../lsp-details';

@Module({
  imports: [
    CrudModule.register(TrainingDetails),
    TrainingTagsModule,
    TrainingDistributionsModule,
    TrainingRecommendedEmployeesModule,
    LspDetailsModule,
  ],
  controllers: [TrainingDetailsController],
  providers: [TrainingDetailsService],
  exports: [TrainingDetailsService],
})
export class TrainingDetailsModule {}
