import { Module } from '@nestjs/common';
import { RfqDetailsService } from './rfq-details.service';
import { RfqDetailsController } from './rfq-details.controller';
import { CrudModule } from '@gscwd-api/crud';
import { RequestForQuotation } from '@gscwd-api/models';

@Module({
  imports: [CrudModule.register(RequestForQuotation)],
  providers: [RfqDetailsService],
  controllers: [RfqDetailsController],
  exports: [RfqDetailsService],
})
export class RfqDetailsModule {}
