import { PassSlipDto, UpdatePassSlipApprovalDto } from '@gscwd-api/models';
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { PassSlipApprovalService } from '../components/approval/core/pass-slip-approval.service';
import { PassSlipService } from './pass-slip.service';

@Controller({ version: '1', path: 'pass-slip' })
export class PassSlipController {
  constructor(private readonly passSlipService: PassSlipService, private readonly passSlipApprovalService: PassSlipApprovalService) {}

  @Post()
  async addPassSlip(@Body() passSlipDto: PassSlipDto) {
    return await this.passSlipService.addPassSlip(passSlipDto);
  }

  @Get(':employee_id')
  async getPassSlips(@Param('employee_id') employeeId: string) {
    return await this.passSlipService.getPassSlipsByEmployeeId(employeeId);
  }

  @Get()
  async getAllPassSlips() {
    return await this.passSlipService.getAllPassSlips();
  }

  @Delete(':pass_slip_id')
  async deletePassSlips(@Param('pass_slip_id') id: string) {
    return await this.passSlipService.deletePassSlip(id);
  }

  @Get('/supervisor/:supervisor_id')
  async getPassSlipsForApproval(@Param('supervisor_id') supervisorId: string) {
    return await this.passSlipService.getPassSlipsBySupervisorId(supervisorId);
  }

  @Patch()
  async updatePassSlipStatus(@Body() updatePassSlipApprovalDto: UpdatePassSlipApprovalDto) {
    return await this.passSlipApprovalService.updatePassSlipStatus(updatePassSlipApprovalDto);
  }
}
