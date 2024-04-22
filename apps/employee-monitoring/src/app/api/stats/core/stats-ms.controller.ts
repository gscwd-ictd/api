import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { StatsService } from './stats.service';

@Controller()
export class StatsMsController {
  constructor(private statsService: StatsService) {}

  @MessagePattern('get_all_ems_applications_per_manager')
  async countAllPendingApplicationsForManager(@Payload() employeeId: string) {
    return await this.statsService.countAllPendingApplicationsForManager(employeeId);
  }
}
