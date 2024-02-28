import { CrudModule } from '@gscwd-api/crud';
import { Tag } from '@gscwd-api/models';
import { Module, forwardRef } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { HrmsEmployeeTagsModule } from '../../../services/hrms';

@Module({
  imports: [CrudModule.register(Tag), forwardRef(() => HrmsEmployeeTagsModule)],
  controllers: [TagsController],
  providers: [TagsService],
  exports: [TagsService],
})
export class TagsModule {}
