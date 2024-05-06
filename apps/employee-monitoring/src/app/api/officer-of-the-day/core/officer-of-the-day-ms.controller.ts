import { Controller } from '@nestjs/common';
import { OfficerOfTheDayService } from './officer-of-the-day.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class OfficerOfTheDayMsController {
  constructor(private readonly officerOfTheDayService: OfficerOfTheDayService) {}

  @MessagePattern('get_officer_of_the_day_orgs')
  async getOfficerOfTheDayOrgs(@Payload() employeeId: string) {
    return await this.officerOfTheDayService.getOfficerOfTheDayOrgs(employeeId);
  }
}
