import { HrmsMicroserviceClientModule } from '@gscwd-api/microservices';
import { Module, forwardRef } from '@nestjs/common';
import { HrmsEmployeeTagsService } from './employee-tags.service';
import { HrmsEmployeeTagsController } from './employee-tags.controller';
import { TagsModule } from '../../../../api/tags';

@Module({
  imports: [HrmsMicroserviceClientModule, forwardRef(() => TagsModule)],
  controllers: [HrmsEmployeeTagsController],
  providers: [HrmsEmployeeTagsService],
  exports: [HrmsEmployeeTagsService],
})
export class HrmsEmployeeTagsModule {}
