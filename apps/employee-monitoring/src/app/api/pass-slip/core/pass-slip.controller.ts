import {
  HrUpdatePassSlipTimeRecordDto,
  PassSlipDto,
  PassSlipHrCancellationDto,
  UpdatePassSlipApprovalDto,
  UpdatePassSlipTimeRecordDto,
} from '@gscwd-api/models';
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
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
  @Get(':employee_id/current')
  async getCurrentPassSlips(@Param('employee_id') employeeId: string) {
    return await this.passSlipService.getCurrentPassSlipsByEmployeeId(employeeId);
  }

  @Get('details/:pass_slip_id')
  async getPassSlipDetails(@Param('pass_slip_id') passSlipId: string) {
    return await this.passSlipService.getPassSlipDetails(passSlipId);
  }

  @Get(':employee_id/approved')
  async getApprovedPassSlipsByEmployeeId(@Param('employee_id') employeeId: string) {
    return await this.passSlipService.getApprovedPassSlipsByEmployeeId(employeeId);
  }

  @Get()
  async getAllPassSlips() {
    return await this.passSlipService.getAllPassSlips();
  }

  @Delete(':pass_slip_id')
  async deletePassSlips(@Param('pass_slip_id') id: string) {
    return await this.passSlipService.deletePassSlip(id);
  }

  @Get('employees/:employee_id/for-dispute/')
  async getPassSlipsForDispute(@Param('employee_id') employeeId: string) {
    return await this.passSlipService.getPassSlipsForDispute(employeeId);
  }

  @Get('/supervisor/:supervisor_id')
  async getPassSlipsForApproval(@Param('supervisor_id') supervisorId: string) {
    return await this.passSlipService.getPassSlipsBySupervisorIdV2(supervisorId);
  }

  @Patch()
  async updatePassSlipStatus(@Body() updatePassSlipApprovalDto: UpdatePassSlipApprovalDto) {
    return await this.passSlipApprovalService.updatePassSlipStatus(updatePassSlipApprovalDto);
  }

  @Patch('time-record/')
  async updatePassSlipTimeRecord(@Body() updatePassSlipTimeRecordDto: UpdatePassSlipTimeRecordDto) {
    return await this.passSlipService.updatePassSlipTimeRecord(updatePassSlipTimeRecordDto);
  }

  //@UseGuards(AuthenticatedGuard)
  @Patch('hr/cancel')
  async cancelPassSlip(@Body() passSlipHrCancellationDto: PassSlipHrCancellationDto) {
    return await this.passSlipService.cancelPassSlip(passSlipHrCancellationDto);
  }

  //@UseGuards(AuthenticatedGuard)
  @Patch('hr/time-record/')
  async hrUpdatePassSlipTimeLog(@Body() hrUpdatePassSlipTimeRecordDto: HrUpdatePassSlipTimeRecordDto) {
    return await this.passSlipService.hrUpdatePassSlipTimeLog(hrUpdatePassSlipTimeRecordDto);
  }

  // @Post('test-cron')
  // async testCron() {
  //   return await this.passSlipService.addPassSlipsToLedger();
  // }

  // @Post('test-cron2')
  // async testCron2() {
  //   return await this.passSlipService.updatePassSlipStatusCron();
  // }

  // @Get('asd/asd/asd/asd/asd/asd')
  // async testCron3() {
  //   return await this.passSlipService.addPassSlipsToLedger();
  // }
}
