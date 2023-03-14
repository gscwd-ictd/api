import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
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

  @Get('test')
  async test() {
    return 'Deployment test';
  }

  @Get('testing')
  async testing() {
    return 'Testing';
  }

  @Get('tests')
  async tes() {
    return 'tests';
  }
}
