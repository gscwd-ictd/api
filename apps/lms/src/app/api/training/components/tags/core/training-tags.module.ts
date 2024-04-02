import { CrudModule } from '@gscwd-api/crud';
import { TrainingTag } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { TrainingTagsService } from './training-tags.service';

@Module({
  imports: [CrudModule.register(TrainingTag)],
  controllers: [],
  providers: [TrainingTagsService],
  exports: [TrainingTagsService],
})
export class TrainingTagsModule {}
