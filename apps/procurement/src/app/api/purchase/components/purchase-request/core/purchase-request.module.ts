import { Module } from '@nestjs/common';
import { PurchaseRequestController } from './purchase-request.controller';
import { PurchaseRequestService } from './purchase-request.service';

@Module({
  controllers: [PurchaseRequestController],
  providers: [PurchaseRequestService],
  exports: [PurchaseRequestService],
})
export class PurchaseRequestModule {}
