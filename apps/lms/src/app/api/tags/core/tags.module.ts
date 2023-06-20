import { CrudModule } from '@gscwd-api/crud';
import { Tag } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';

@Module({
  imports: [CrudModule.register(Tag)],
  controllers: [TagsController],
  providers: [TagsService],
  exports: [TagsService],
})
export class TagsModule {}
