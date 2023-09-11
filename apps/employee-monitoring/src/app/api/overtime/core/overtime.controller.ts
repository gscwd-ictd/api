import { CreateOvertimeDto } from '@gscwd-api/models';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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
    /*
    
    export type Overtime = {
      id: string;
      plannedDate: string;
      immediateSupervisorName: string;
      employees: Array<EmployeeOvertimeDetails>;
      estimatedNoOfHours: number;
      purpose: string;
      status: OvertimeStatus;
    };
      
    */
    return await this.overtimeService.getOvertimeApplications();
  }

  @Get(':employee_id/:overtime_application_id/details')
  async getOvertimeDetails(@Param('employee_id') employeeId: string, @Param('overtime_application_id') overtimeApplicationId: string) {
    return await this.overtimeService.getOvertimeDetails(employeeId, overtimeApplicationId);
  }
}
