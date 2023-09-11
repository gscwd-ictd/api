import { Module } from '@nestjs/common';
import { OvertimeImmediateSupervisorService } from './overtime-immediate-supervisor.service';
import { OvertimeImmediateSupervisorController } from './overtime-immediate-supervisor.controller';
import { CrudModule } from '@gscwd-api/crud';
import { OvertimeImmediateSupervisor } from '@gscwd-api/models';

@Module({
  imports: [CrudModule.register(OvertimeImmediateSupervisor)],
  providers: [OvertimeImmediateSupervisorService],
  controllers: [OvertimeImmediateSupervisorController],
  exports: [OvertimeImmediateSupervisorService],
})
export class OvertimeImmediateSupervisorModule {}
