import { Controller, UseFilters } from '@nestjs/common';
import { OfficerOfTheDayService } from './officer-of-the-day.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { MsExceptionFilter } from '@gscwd-api/utils';

@Controller()
export class OfficerOfTheDayMsController {
  constructor(private readonly officerOfTheDayService: OfficerOfTheDayService) { }

  @UseFilters(new MsExceptionFilter())
  @MessagePattern('get_officer_of_the_day_orgs')
  async getOfficerOfTheDayOrgs(@Payload() employeeId: string) {
    try {
      return await this.officerOfTheDayService.getOfficerOfTheDayOrgs(employeeId);
    }
    catch (error) {
      throw new RpcException(error.message);
    }

  }
}
