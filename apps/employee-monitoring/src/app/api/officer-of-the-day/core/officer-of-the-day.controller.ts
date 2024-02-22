import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { OfficerOfTheDayService } from './officer-of-the-day.service';
import { OfficerOfTheDayDto } from '@gscwd-api/models';

@Controller({ version: '1', path: 'officer-of-the-day' })
export class OfficerOfTheDayController {
  constructor(private readonly officerOfTheDayService: OfficerOfTheDayService) {}

  @Get()
  async findAll() {
    return await this.officerOfTheDayService.findAll();
  }

  @Get('assignable/employee')
  async getAssignableOfficerOfTheDay() {
    return await this.officerOfTheDayService.getAssignableOfficerOfTheDay();
  }

  @Get('assignable/org')
  async getAssignableOrganization() {
    return await this.officerOfTheDayService.getAssignableOrgStruct();
  }

  @Post()
  async setOfficerOfTheDay(@Body() officerOfTheDayDto: OfficerOfTheDayDto) {
    return await this.officerOfTheDayService.setOfficerOfTheDay(officerOfTheDayDto);
  }

  @Delete(':ootd_id')
  async deleteOfficerOfTheDay(@Param('ootd_id') id: string) {
    return await this.officerOfTheDayService.deleteOfficerOfTheDay(id);
  }
}
