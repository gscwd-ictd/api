import { OvertimeSummaryHalf } from '@gscwd-api/utils';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { OvertimeService } from './overtime.service';

@Controller({ version: '1', path: 'overtime/reports' })
export class OvertimeReportsController {
  constructor(private overtimeService: OvertimeService) { }

  @Get(':overtime_application_id/:immediate_supervisor_employee_id')
  async getOvertimeAuthorization(
    @Param('overtime_application_id') overtimeApplicationId: string,
    @Param('immediate_supervisor_employee_id') immediateSupervisorEmployeeId: string
  ) {
    return await this.overtimeService.getOvertimeAuthorization(overtimeApplicationId, immediateSupervisorEmployeeId);
  }

  @Get(':immediate_supervisor_employee_id/:year/:month/')
  async getOvertimeSummaryRegular(
    @Param('immediate_supervisor_employee_id') immediateSupervisorEmployeeId: string,
    @Param('year') year: number,
    @Param('month') month: number,
    @Query('half') half: OvertimeSummaryHalf,
    @Query('nature_of_appointment') natureOfAppointment: string
  ) {
    return await this.overtimeService.getOvertimeSummaryRegular(immediateSupervisorEmployeeId, year, month, half, natureOfAppointment);
  }

  @Get('/accomplishment/individual/:overtime_application_id/:employee_id/')
  async getIndividualOvertimeAccomplishment(
    @Param('overtime_application_id') overtimeApplicationId: string,
    @Param('employee_id') employeeId: string
  ) {
    return await this.overtimeService.getIndividualOvertimeAccomplishment(overtimeApplicationId, employeeId);
  }

  @Get('/accomplishment/authorization/summary/:immediate_supervisor_employee_id/:year/:month/')
  async getOvertimeAuthorizationAccomplishmentSummary(
    @Param('immediate_supervisor_employee_id') immediateSupervisorEmployeeId: string,
    @Param('year') year: number,
    @Param('month') month: number,
    @Query('half') half: OvertimeSummaryHalf,
    @Query('nature_of_appointment') natureOfAppointment: string
  ) {
    return await this.overtimeService.getOvertimeAuthorizationAccomplishmentSummary(immediateSupervisorEmployeeId, year, month, half, natureOfAppointment);
  }
}
