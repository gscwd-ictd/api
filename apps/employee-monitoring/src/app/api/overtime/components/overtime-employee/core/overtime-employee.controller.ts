import { Body, Controller, Delete, Get } from '@nestjs/common';
import { OvertimeEmployeeService } from './overtime-employee.service';
import { CreateOvertimeEmployeeDto, DeleteOvertimeEmployeeDto } from '@gscwd-api/models';

@Controller({ version: '1', path: 'overtime-employee' })
export class OvertimeEmployeeController {
  constructor(private readonly overtimeEmployeeService: OvertimeEmployeeService) { }
}
