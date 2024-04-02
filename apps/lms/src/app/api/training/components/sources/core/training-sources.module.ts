import { CrudModule } from '@gscwd-api/crud';
import { TrainingSource } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { TrainingSourcesService } from './training-sources.service';
import { TrainingSourcesController } from './training-sources.controller';

@Module({
  imports: [CrudModule.register(TrainingSource)],
  controllers: [TrainingSourcesController],
  providers: [TrainingSourcesService],
  exports: [TrainingSourcesService],
})
export class TrainingSourcesModule {}
