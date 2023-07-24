import { CreateEmployeeScheduleDto } from '@gscwd-api/models';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EmployeeScheduleService } from './employee-schedule.service';

@Controller('employee-schedule')
export class EmployeeScheduleMsController {
  constructor(private readonly employeeScheduleService: EmployeeScheduleService) {}

  @MessagePattern('add_employee_schedule')
  async addEmployeeSchedule(@Payload() employeeScheduleDto: CreateEmployeeScheduleDto) {
    return await this.employeeScheduleService.addEmployeeSchedule(employeeScheduleDto);
  }
}
