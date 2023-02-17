import { Module } from '@nestjs/common';
import { RfqService } from './rfq.service';
import { RfqController } from './rfq.controller';
import { RfqDetailsModule } from '../components/rfq-details';
import { RequestedItemsModule } from '../../request/components';

@Module({
  imports: [RfqDetailsModule, RequestedItemsModule],
  providers: [RfqService],
  controllers: [RfqController],
})
export class RfqModule {}
