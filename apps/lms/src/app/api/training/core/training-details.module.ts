import { CrudModule } from '@gscwd-api/crud';
import { TrainingDetails } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { TrainingDetailsService } from './training-details.service';
import { TrainingDetailsController } from './training-details.controller';
import { TrainingLspDetailsModule } from '../components/lsp';
import { TrainingTagsModule } from '../components/tags';
import { TrainingDistributionsModule } from '../components/slot-distributions';
import { TrainingDetailsMicroserviceController } from './training-details-ms.controller';

@Module({
  imports: [CrudModule.register(TrainingDetails), TrainingLspDetailsModule, TrainingTagsModule, TrainingDistributionsModule],
  controllers: [TrainingDetailsController, TrainingDetailsMicroserviceController],
  providers: [TrainingDetailsService],
  exports: [TrainingDetailsService],
})
export class TrainingDetailsModule {}
