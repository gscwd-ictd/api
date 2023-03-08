import { CrudModule } from '@gscwd-api/crud';
import { RequestForQuotation } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { RequestForQuotationController } from './request-for-quotation.controller';
import { RequestForQuotationService } from './request-for-quotation.service';

@Module({
  imports: [CrudModule.register(RequestForQuotation)],
  controllers: [RequestForQuotationController],
  providers: [RequestForQuotationService],
  exports: [RequestForQuotationService],
})
export class RequestForQuotationModule {}
