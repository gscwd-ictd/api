import { CreateRfqDto } from '@gscwd-api/models';
import { Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Post, Query, UseInterceptors } from '@nestjs/common';
import { CreateRequestForQuotationInterceptor } from '../misc/create-rfq.interceptor';
import { RequestForQuotationService } from './request-for-quotation.service';

@Controller({ version: '1', path: 'rfq' })
export class RequestForQuotationController {
  constructor(
    // inject rfq service
    private readonly rfqService: RequestForQuotationService
  ) {}

  @UseInterceptors(CreateRequestForQuotationInterceptor)
  @Post()
  async create(@Body() rfqDto: CreateRfqDto) {
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
  async findById(@Param('id') id: string) {
    return await this.rfqService.getRfqDetails(id);
  }
}
