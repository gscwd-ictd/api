import { Module } from '@nestjs/common';
import { CrudModule } from '@gscwd-api/crud';
import { PrDetailsService } from './pr-details.service';
import { PrDetailsController } from './pr-details.controller';
import { PurchaseRequest } from '@gscwd-api/models';

@Module({
  imports: [CrudModule.register(PurchaseRequest)],
  providers: [PrDetailsService],
  controllers: [PrDetailsController],
  exports: [PrDetailsService],
})
export class PrDetailsModule {}
