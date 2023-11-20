import { CrudModule } from '@gscwd-api/crud';
import { TrainingLspDetails } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { TrainingLspDetailsService } from './training-lsp-details.services';
import { TrainingLspDetailsController } from './training-lsp-details.controller';
import { LspDetailsModule } from '../../../../lsp-details';

@Module({
  imports: [CrudModule.register(TrainingLspDetails), LspDetailsModule],
  controllers: [TrainingLspDetailsController],
  providers: [TrainingLspDetailsService],
  exports: [TrainingLspDetailsService],
})
export class TrainingLspDetailsModule {}
