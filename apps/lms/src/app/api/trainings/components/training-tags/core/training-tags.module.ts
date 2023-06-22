import { CrudModule } from '@gscwd-api/crud';
import { TrainingTag } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { TrainingTagsService } from './training-tags.service';
import { TrainingTagsController } from './training-tags.controller';

@Module({
  imports: [CrudModule.register(TrainingTag)],
  controllers: [TrainingTagsController],
  providers: [TrainingTagsService],
  exports: [TrainingTagsService],
})
export class TrainingTagsModule {}
