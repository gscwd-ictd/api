import { CrudModule } from '@gscwd-api/crud';
import { PurchaseType } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { PurchaseTypeController } from './purchase-type.controller';
import { PurchaseTypeService } from './purchase-type.service';

@Module({
  imports: [CrudModule.register(PurchaseType)],
  controllers: [PurchaseTypeController],
  providers: [PurchaseTypeService],
})
export class PurchaseTypeModule {}
