import { CreateOvertimeDto } from '@gscwd-api/models';
import { Body, Controller, Get, Post } from '@nestjs/common';
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
}
