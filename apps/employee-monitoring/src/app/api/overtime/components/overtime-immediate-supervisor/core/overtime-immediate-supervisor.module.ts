import { Module } from '@nestjs/common';
import { OvertimeImmediateSupervisorService } from './overtime-immediate-supervisor.service';
import { OvertimeImmediateSupervisorController } from './overtime-immediate-supervisor.controller';

@Module({
  providers: [OvertimeImmediateSupervisorService],
  controllers: [OvertimeImmediateSupervisorController]
})
export class OvertimeImmediateSupervisorModule {}
