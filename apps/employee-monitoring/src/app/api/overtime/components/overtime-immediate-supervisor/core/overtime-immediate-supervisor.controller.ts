import { CreateOvertimeImmediateSupervisorDto } from '@gscwd-api/models';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { OvertimeImmediateSupervisorService } from '../core/overtime-immediate-supervisor.service';

@Controller({ path: 'overtime-immediate-supervisor', version: '1' })
export class OvertimeImmediateSupervisorController {
  constructor(private readonly overtimeImmediateSupervisorService: OvertimeImmediateSupervisorService) {}

  @Post()
  async assignOvertimeImmediateSupervisor(@Body() createOvertimeImmediateSupervisorDto: CreateOvertimeImmediateSupervisorDto) {
    return await this.overtimeImmediateSupervisorService.assignOvertimeImmediateSupervisor(createOvertimeImmediateSupervisorDto);
  }

  @Get()
  async getOvertimeSupervisors() {}
}
