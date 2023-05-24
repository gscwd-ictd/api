import { CrudModule } from '@gscwd-api/crud';
import { TrainingType } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { TrainingTypesController } from './training-types.controller';
import { TrainingTypesService } from './training-types.service';

@Module({
  imports: [CrudModule.register(TrainingType)],
  controllers: [TrainingTypesController],
  providers: [TrainingTypesService],
  exports: [TrainingTypesService],
})
export class TrainingTypesModule {}
