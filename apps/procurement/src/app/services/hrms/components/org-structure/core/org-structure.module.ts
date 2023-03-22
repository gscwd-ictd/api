import { Module } from '@nestjs/common';
import { OrgStructureService } from './org-structure.service';
import { OrgStructureController } from './org-structure.controller';
import { HrmsMicroserviceClientModule } from '@gscwd-api/microservices';

@Module({
  imports: [HrmsMicroserviceClientModule],
  providers: [OrgStructureService],
  controllers: [OrgStructureController],
  exports: [OrgStructureService],
})
export class OrgStructureModule {}
