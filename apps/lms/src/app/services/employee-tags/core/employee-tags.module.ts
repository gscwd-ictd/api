import { LmsMicroserviceClientModule } from '@gscwd-api/microservices';
import { Module } from '@nestjs/common';
import { EmployeeTagsService } from './employee-tags.service';
import { EmployeeTagsController } from './employee-tags.controller';
import { TagsModule } from '../../../api/tags';

@Module({
  imports: [LmsMicroserviceClientModule, TagsModule],
  controllers: [EmployeeTagsController],
  providers: [EmployeeTagsService],
  exports: [EmployeeTagsService],
})
export class EmployeeTagsModule {}
