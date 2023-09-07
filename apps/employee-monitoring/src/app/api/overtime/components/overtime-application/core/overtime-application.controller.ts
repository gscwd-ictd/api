import { Controller, Post } from '@nestjs/common';
import { OvertimeApplicationService } from './overtime-application.service';

@Controller('overtime-application')
export class OvertimeApplicationController {
  constructor(private readonly overtimeApplicationService: OvertimeApplicationService) {}

  @Post()
  async createOvertimeApplication() {
    return ';';
  }
}
