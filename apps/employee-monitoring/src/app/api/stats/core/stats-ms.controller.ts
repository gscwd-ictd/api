import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { StatsService } from './stats.service';
import { MsExceptionFilter } from '@gscwd-api/utils';

@Controller()
export class StatsMsController {
  constructor(private statsService: StatsService) { }

  @UseFilters(new MsExceptionFilter())
  @MessagePattern('get_all_ems_applications_per_manager')
  async countAllPendingApplicationsForManager(@Payload() employeeId: string) {
    try {
      return await this.statsService.countAllPendingApplicationsForManager(employeeId);
    }
    catch (error) {
      throw new RpcException(error.message);
    }

  }
}
