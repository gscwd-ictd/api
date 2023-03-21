import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { CreatePrDto } from '../data/pr.dto';
import { CreatePurchaseRequestInterceptor } from '../misc/create-pr.interceptor';
import { PurchaseRequestService } from './purchase-request.service';

@Controller({ version: '1', path: 'pr' })
export class PurchaseRequestController {
  constructor(private readonly prService: PurchaseRequestService) {}

  @UseInterceptors(CreatePurchaseRequestInterceptor)
  @Post()
  async create(@Body() prDto: CreatePrDto) {
    return await this.prService.createRawPr(prDto);
  }
}
