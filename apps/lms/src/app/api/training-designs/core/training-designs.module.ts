import { Module } from '@nestjs/common';
import { TrainingDesignsService } from './training-designs.service';
import { TrainingDesignsController } from './training-designs.controller';
import { CrudModule } from '@gscwd-api/crud';
import { TrainingDesign } from '@gscwd-api/models';

@Module({
  imports: [CrudModule.register(TrainingDesign)],
  controllers: [TrainingDesignsController],
  providers: [TrainingDesignsService],
  exports: [TrainingDesignsService],
})
export class TrainingDesignsModule {}
