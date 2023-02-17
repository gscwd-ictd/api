import { Body, Controller, Post } from '@nestjs/common';
import { CreateQuotationRequestDto } from '../data/rfq.dto';
import { RfqService } from './rfq.service';

@Controller({ version: '1', path: 'rfq' })
export class RfqController {
  constructor(private readonly rfqService: RfqService) {}

  @Post()
  async create(@Body() rfqDto: CreateQuotationRequestDto) {
    return await this.rfqService.createRfq(rfqDto);
  }
}
