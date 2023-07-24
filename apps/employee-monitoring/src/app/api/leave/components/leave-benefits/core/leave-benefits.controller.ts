import { CreateLeaveBenefitsDto, UpdateLeaveBenefitsDto } from '@gscwd-api/models';
import { LeaveTypes } from '@gscwd-api/utils';
import { Body, Controller, Delete, Get, Param, Put, Post, Query } from '@nestjs/common';
import { LeaveBenefitsService } from './leave-benefits.service';

@Controller({ version: '1', path: 'leave-benefits' })
export class LeaveBenefitsController {
  constructor(private readonly leaveBenefitsService: LeaveBenefitsService) {}

  @Post()
  async createLeaveBenefits(@Body() leaveBenefitsDTO: CreateLeaveBenefitsDto) {
    return await this.leaveBenefitsService.createLeaveBenefits(leaveBenefitsDTO);
  }

  @Get()
  async getAllLeaveBenefits(@Query('type') leaveType: LeaveTypes) {
    return await this.leaveBenefitsService.getLeaveBenefitsByType(leaveType);
  }

  @Delete(':leave_benefit_id')
  async deleteLeaveBenefit(@Param('leave_benefit_id') leaveBenefitId: string) {
    return await this.leaveBenefitsService.deleteLeaveBenefit(leaveBenefitId);
  }

  @Put()
  async updateLeaveBenefit(@Body() updateLeaveBenefitsDto: UpdateLeaveBenefitsDto) {
    return await this.leaveBenefitsService.updateLeaveBenefits(updateLeaveBenefitsDto);
  }
}
