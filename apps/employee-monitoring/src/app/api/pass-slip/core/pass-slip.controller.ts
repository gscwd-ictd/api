import { PassSlipDto } from '@gscwd-api/models';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PassSlipService } from './pass-slip.service';

@Controller({ version: '1', path: 'pass-slip' })
export class PassSlipController {
  constructor(private readonly passSlipService: PassSlipService) {}

  @Post()
  async addPassSlip(@Body() passSlipDto: PassSlipDto) {
    return await this.passSlipService.addPassSlip(passSlipDto);
  }

  @Get(':employee_id')
  async getPassSlips(@Param('employee_id') employeeId: string) {
    return await this.passSlipService.getPassSlips(employeeId);
  }

  @Get()
  async getAllPassSlips() {
    return await this.passSlipService.getAllPassSlips();
  }
}
