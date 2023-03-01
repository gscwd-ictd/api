import { Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { CreatePurchaseRequestDto } from '../data/pr.dto';
import { PurchaseRequestService } from './purchase-request.service';

@Controller({ version: '1', path: 'pr' })
export class PurchaseRequestController {
  constructor(private readonly prService: PurchaseRequestService) {}

  @Post()
  async create(@Body() prDto: CreatePurchaseRequestDto) {
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
    return await this.prService.findPrById(id);
  }
}