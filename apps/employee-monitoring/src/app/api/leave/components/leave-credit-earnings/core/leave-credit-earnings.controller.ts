import { CreateLeaveCreditEarningsDto, UpdateLeaveCreditEarningsDto } from '@gscwd-api/models';
import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { LeaveCreditEarningsService } from './leave-credit-earnings.service';

@Controller({ version: '1', path: 'leave-credit-earnings' })
export class LeaveCreditEarningsController {
  constructor(private leaveCreditService: LeaveCreditEarningsService) {}

  @Post()
  async addLeaveCreditEarning(@Body() leaveCreditEarningsDto: CreateLeaveCreditEarningsDto) {
    return await this.leaveCreditService.addLeaveCreditEarnings(leaveCreditEarningsDto);
  }

  @Put()
  async updateLeaveCreditEarning(@Body() leaveCreditEarningsDto: UpdateLeaveCreditEarningsDto) {
    return await this.leaveCreditService.updateLeaveCreditEarnings(leaveCreditEarningsDto);
  }
}
