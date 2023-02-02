import { CreateLeaveBenefitsDto } from '@gscwd-api/models';
import { Body, Controller, Post } from '@nestjs/common';
import { LeaveBenefitsService } from './leave-benefits.service';

@Controller({ version: '1', path: 'leave-benefits' })
export class LeaveBenefitsController {
  constructor(private readonly leaveBenefitsService: LeaveBenefitsService) {}

  @Post()
  async createLeaveBenefits(@Body() leaveBenefitsDTO: CreateLeaveBenefitsDto) {
    return await this.leaveBenefitsService.createLeaveBenefits(leaveBenefitsDTO);
  }
}
