import { Module } from '@nestjs/common';
import { PrDetailsModule, RequestedItemsModule } from '../components';
import { PrController } from './pr.controller';
import { PrService } from './pr.service';
import { OrgStructureModule } from '../../../../../services/hrms/components/org-structure';

@Module({
  imports: [PrDetailsModule, RequestedItemsModule, OrgStructureModule],
  providers: [PrService],
  controllers: [PrController],
})
export class PrModule {}
