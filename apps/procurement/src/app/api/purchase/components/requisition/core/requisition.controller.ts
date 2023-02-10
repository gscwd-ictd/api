import { CreatePurchaseRequestDto } from '@gscwd-api/models';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PurchaseRequisitionService } from './requisition.service';

@Controller({ version: '1', path: 'test' })
export class PurchaseRequisitionController {
  constructor(private readonly requisitionService: PurchaseRequisitionService) {}

  @Get(':id')
  async findPurchaseRequestById(@Param('id') id: string) {
    return await this.requisitionService.findPurchaseRequestById(id);
  }

  @Post()
  async createPurchaseRequest(@Body() purchaseRequestDto: CreatePurchaseRequestDto) {
    return await this.requisitionService.createPurchaseRequest(purchaseRequestDto);
  }
}
