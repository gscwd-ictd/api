import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { EmsSettingsService } from './ems-settings.service';

@Controller({ version: '1', path: 'ems-settings' })
export class EmsSettingsController {
  constructor(private readonly emsSettingsService: EmsSettingsService) {}

  @Get('/monetization')
  async getMonetizationConstant() {
    return await this.emsSettingsService.getMonetizationConstant();
  }

  //#region HR pass slip approvers (EMS Settings > HR Pass Slip Approvers; portal pass slip supervisor list)
  @Get('/hr-pass-slip-approvers')
  async getHrPassSlipApprovers() {
    return await this.emsSettingsService.getHrPassSlipApprovers();
  }

  @Get('/hr-pass-slip-approvers/options')
  async getHrPassSlipApproverOptions() {
    return await this.emsSettingsService.getHrPassSlipApproverOptions();
  }

  @Get('/hr-pass-slip-approvers/:employee_id/is-approver')
  async isHrPassSlipApprover(@Param('employee_id') employeeId: string) {
    return await this.emsSettingsService.isHrPassSlipApprover(employeeId);
  }

  @Post('/hr-pass-slip-approvers')
  async addHrPassSlipApprover(@Body() body: { employeeId: string }) {
    return await this.emsSettingsService.addHrPassSlipApprover(body?.employeeId);
  }

  @Delete('/hr-pass-slip-approvers/:id')
  async deleteHrPassSlipApprover(@Param('id') id: string) {
    return await this.emsSettingsService.deleteHrPassSlipApprover(id);
  }
  //#endregion
}
