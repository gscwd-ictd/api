import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { RequestedItemsService } from '../../request/components';
import { RfqDetailsService } from '../components/rfq-details';
import { CreateQuotationRequestDto } from '../data/rfq.dto';

@Injectable()
export class RfqService {
  constructor(
    // inject rfq details service
    private readonly rfqDetailsService: RfqDetailsService,

    // inject requested items service
    private readonly requestedItemsService: RequestedItemsService,

    // inject datasrouce
    private readonly datasource: DataSource
  ) {}

  async createRfq(rfqDto: CreateQuotationRequestDto) {
    // deconstruct rfq object
    const {
      items,
      details: { ...rfqDetailsDto },
    } = rfqDto;

    return await this.datasource.manager.transaction(async (manager) => {
      // create request for quotation details
      const requestForQuotation = await this.rfqDetailsService.tx_createRfqDetails(manager, rfqDetailsDto);

      // await for this process to complete
      const itemsForQuotation = await Promise.all(
        // loop through all items
        items.map(async (item) => {
          // find requested item by id
          const requestedItem = await this.requestedItemsService.tx_findItemById(manager, item.id);

          // update requested item to add rfq
          return await this.requestedItemsService.tx_updateItemForRfq(manager, requestedItem, requestForQuotation);
        })
      );

      return { rfq: requestForQuotation, items: itemsForQuotation.length };
    });
  }
}
