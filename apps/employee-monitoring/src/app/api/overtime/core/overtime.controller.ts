import { CreateOvertimeDto, UpdateOvertimeAccomplishmentDto, UpdateOvertimeApprovalDto } from '@gscwd-api/models';
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { OvertimeService } from './overtime.service';

@Controller({ version: '1', path: 'overtime' })
export class OvertimeController {
  constructor(private readonly overtimeService: OvertimeService) {}

  @Post()
  async createOvertime(@Body() createOverTimeDto: CreateOvertimeDto) {
    return await this.overtimeService.createOvertime(createOverTimeDto);
  }

  @Get()
  async getOvertimeApplications() {
    return await this.overtimeService.getOvertimeApplications();
  }

  @Get(':manager_id/approval')
  async getOvertimeApproval(@Param('manager_id') managerId: string) {
    return await this.overtimeService.getOvertimeApplicationsForApproval(managerId);
  }

  @Get(':immediate_supervisor_id')
  async getOvertimeApplicationsBySupervisorId(@Param('immediate_supervisor_id') immediateSupervisorId: string) {
    return await this.overtimeService.getOvertimeApplicationsByImmediateSupervisorId(immediateSupervisorId);
  }

  @Get(':employee_id/:overtime_application_id/details')
  async getOvertimeDetails(@Param('employee_id') employeeId: string, @Param('overtime_application_id') overtimeApplicationId: string) {
    return await this.overtimeService.getOvertimeDetails(employeeId, overtimeApplicationId);
  }

  @Patch('/approval')
  async approveOvertime(@Body() updateOvertimeApprovalDto: UpdateOvertimeApprovalDto) {
    return await this.overtimeService.approveOvertime(updateOvertimeApprovalDto);
  }

  @Patch('/accomplishments/approval')
  async approveOvertimeAccomplishment(@Body() updateOvertimeAccomplishmentDto: UpdateOvertimeAccomplishmentDto) {
    return await this.overtimeService.updateOvertimeAccomplishment(updateOvertimeAccomplishmentDto);
  }

  @Patch(':employee_id/:overtime_application_id')
  async updateOvertimeAccomplishment(@Body() updateOvertimeAccomplishmentDto: UpdateOvertimeAccomplishmentDto) {
    return await this.overtimeService.updateOvertimeAccomplishment(updateOvertimeAccomplishmentDto);
  }

  @Get('supervisor/:employee_id/employees')
  async getEmployeeListBySupervisorId(@Param('employee_id') employeeId: string) {
    return await this.overtimeService.getEmployeeListBySupervisorId(employeeId);
  }

  @Get('immediate-supervisors')
  async getImmediateSupervisorList() {
    return await this.overtimeService.getImmediateSupervisorList();
  }
}
