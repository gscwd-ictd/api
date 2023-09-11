import { Controller } from '@nestjs/common';
import { OvertimeEmployeeService } from './overtime-employee.service';

@Controller('overtime-employee')
export class OvertimeEmployeeController {
  constructor(private readonly overtimeEmployeeService: OvertimeEmployeeService) {}
}
