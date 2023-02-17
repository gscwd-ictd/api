import { Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { CreateQuotationRequestDto } from '../data/rfq.dto';
import { RequestForQuotationService } from './request-for-quotation.service';

@Controller({ version: '1', path: 'rfq' })
export class RequestForQuotationController {
  constructor(private readonly rfqService: RequestForQuotationService) {}

  @Post()
  async create(@Body() rfqDto: CreateQuotationRequestDto) {
    return await this.rfqService.createRfq(rfqDto);
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    return await this.rfqService.findAllRfqs({ page, limit });
  }

  @Get(':id')
  async findOneBy(@Param('id') id: string) {
    return await this.rfqService.findRfqById(id);
  }
}
