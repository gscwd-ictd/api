import {
  CreateOvertimeDto,
  UpdateOvertimeAccomplishmentByEmployeeDto,
  UpdateOvertimeAccomplishmentDto,
  UpdateOvertimeApprovalDto,
} from '@gscwd-api/models';
import { Body, Controller, Delete, Get, Param, Patch, Post, UseInterceptors } from '@nestjs/common';
import { UserLogsInterceptor } from '../../user-logs/misc/interceptors/user-logs.interceptor';
import { OvertimeService } from './overtime.service';

//@UseInterceptors(UserLogsInterceptor)
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

  @Get(':overtime_application_id/accomplishments/employees')
  async getOvertimeAccomplishmentsByOvertimeApplicationId(@Param('overtime_application_id') overtimeApplicationId: string) {
    console.log(overtimeApplicationId);
  }

  @Get('immediate-supervisors')
  async getImmediateSupervisorList() {
    return await this.overtimeService.getImmediateSupervisorList();
  }

  @Get(':manager_id/approval')
  async getOvertimeApprovals(@Param('manager_id') managerId: string) {
    return await this.overtimeService.getOvertimeApplicationsForApprovalV2(managerId);
  }

  @Get(':manager_id/approval/:overtime_application_id')
  async getOvertimeApproval(@Param('manager_id') managerId: string, @Param('overtime_application_id') id: string) {
    return await this.overtimeService.getOvertimeApplicationDetailByManagerIdAndId(managerId, id);
  }

  @Get(':immediate_supervisor_id')
  async getOvertimeApplicationsBySupervisorId(@Param('immediate_supervisor_id') immediateSupervisorId: string) {
    return await this.overtimeService.getOvertimeApplicationsByImmediateSupervisorId(immediateSupervisorId);
  }

  @Get(':employee_id/:overtime_application_id/details')
  async getOvertimeDetails(@Param('employee_id') employeeId: string, @Param('overtime_application_id') overtimeApplicationId: string) {
    return await this.overtimeService.getOvertimeDetails(employeeId, overtimeApplicationId);
  }

  @Get('/employees/:employee_id/accomplishments')
  async getOvertimeAccomplishmentByEmployeeId(@Param('employee_id') employeeId: string) {
    return await this.overtimeService.getOvertimeAccomplishmentByEmployeeId(employeeId);
  }

  @Get('/employees/:employee_id/list')
  async getOvertimesByEmployeeId(@Param('employee_id') employeeId: string) {
    return await this.overtimeService.getOvertimesByEmployeeId(employeeId);
  }

  @Get('/employees/:employee_id/notifications')
  async getNotifsOvertimesByEmployeeId(@Param('employee_id') employeeId: string) {
    return await this.overtimeService.getNotifsOvertimesByEmployeeId(employeeId);
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

  @Patch('employees/accomplishments')
  async updateAccomplishments(@Body() updateOvertimeAccomplishmentByEmployeeDto: UpdateOvertimeAccomplishmentByEmployeeDto) {
    return await this.overtimeService.updateAccomplishments(updateOvertimeAccomplishmentByEmployeeDto);
  }

  @Delete('/immediate-supervisors/:overtime_immediate_supervisor_id')
  async deleteAccomplishments(@Param('overtime_immediate_supervisor_id') overtimeImmediateSupervisorId: string) {
    return await this.overtimeService.deleteImmediateSupervisor(overtimeImmediateSupervisorId);
  }
}
