import { CreatePurchaseRequestDto } from '@gscwd-api/models';
import { Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { PurchaseRequisitionService } from './requisition.service';

@Controller({ version: '1', path: 'test' })
export class PurchaseRequisitionController {
  constructor(private readonly requisitionService: PurchaseRequisitionService) {}

  @Get()
  async findAllPurchaseRequests(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    return await this.requisitionService.findAllPurchaseRequests({ page, limit });
  }

  @Get(':id')
  async findPurchaseRequestById(@Param('id') id: string) {
    return await this.requisitionService.findPurchaseRequestById(id);
  }

  @Post()
  async createPurchaseRequest(@Body() purchaseRequestDto: CreatePurchaseRequestDto) {
    return await this.requisitionService.createPurchaseRequest(purchaseRequestDto);
  }
}
