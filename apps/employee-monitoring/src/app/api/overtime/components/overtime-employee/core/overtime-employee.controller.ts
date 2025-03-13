import { Controller } from '@nestjs/common';
import { OvertimeEmployeeService } from './overtime-employee.service';

@Controller({ version: '1', path: 'overtime-employee' })
export class OvertimeEmployeeController {
  constructor(private readonly overtimeEmployeeService: OvertimeEmployeeService) { }
}
