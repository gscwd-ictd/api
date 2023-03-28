import { Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Post, Query, UseInterceptors } from '@nestjs/common';
import { CreatePrDto } from '../data/pr.dto';
import { CreatePurchaseRequestInterceptor } from '../misc/create-pr.interceptor';
import { PurchaseRequestService } from './purchase-request.service';

@Controller({ version: '1', path: 'pr' })
export class PurchaseRequestController {
  constructor(private readonly prService: PurchaseRequestService) {}

  @UseInterceptors(CreatePurchaseRequestInterceptor)
  @Post()
  async create(@Body() prDto: CreatePrDto) {
    return await this.prService.createPr(prDto);
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    return await this.prService.findAllPrs({ page, limit });
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.prService.getPrDetails(id);
  }
}
