import { OvertimeSummaryHalf } from '@gscwd-api/utils';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { OvertimeService } from './overtime.service';

@Controller({ version: '1', path: 'overtime/reports' })
export class OvertimeReportsController {
  constructor(private overtimeService: OvertimeService) {}

  @Get(':overtime_application_id/:immediate_supervisor_employee_id')
  async getOvertimeAuthorization(
    @Param('overtime_application_id') overtimeApplicationId: string,
    @Param('immediate_supervisor_employee_id') immediateSupervisorEmployeeId: string
  ) {
    return await this.overtimeService.getOvertimeAuthorization(overtimeApplicationId, immediateSupervisorEmployeeId);
  }

  @Get(':immediate_supervisor_employee_id/:year/:month/')
  async getOvertimeSummary(
    @Param('immediate_supervisor_employee_id') immediateSupervisorEmployeeId: string,
    @Param('year') year: number,
    @Param('month') month: number,
    @Query('half') half: OvertimeSummaryHalf
  ) {
    return await this.overtimeService.getOvertimeSummaryRegular(immediateSupervisorEmployeeId, year, month, half);
  }

  @Get('/accomplishment/individual/:overtime_application_id/:employee_id/')
  async getIndividualOvertimeAccomplishment(
    @Param('overtime_application_id') overtimeApplicationId: string,
    @Param('employee_id') employeeId: string
  ) {
    return await this.overtimeService.getIndividualOvertimeAccomplishment(overtimeApplicationId, employeeId);
  }
}
