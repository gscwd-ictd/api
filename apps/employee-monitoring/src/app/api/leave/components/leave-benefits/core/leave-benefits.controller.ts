import { CreateLeaveBenefitsDto } from '@gscwd-api/models';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { LeaveBenefitsService } from './leave-benefits.service';

@Controller({ version: '1', path: 'leave-benefits' })
export class LeaveBenefitsController {
  constructor(private readonly leaveBenefitsService: LeaveBenefitsService) {}

  @Post()
  async createLeaveBenefits(@Body() leaveBenefitsDTO: CreateLeaveBenefitsDto) {
    return await this.leaveBenefitsService.createLeaveBenefits(leaveBenefitsDTO);
  }

  @Get()
  async getAllLeaveBenefits() {
    return await this.leaveBenefitsService.crud().findAll({ find: { select: { id: true, leaveName: true }, order: { leaveName: 'ASC' } } });
  }
}
