import { HolidaysDto } from '@gscwd-api/models';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { HolidaysService } from './holidays.service';

@Controller({ version: '1', path: 'holidays' })
export class HolidaysController {
  constructor(private readonly holidayService: HolidaysService) {}
  
  @Post()
  async addHolidays(@Body() holidaysDto: HolidaysDto) {
    return await this.holidayService.addHoliday(holidaysDto);
  }

  @Get()
  async getHolidaysForTheCurrentYear() {
    return await this.holidayService.getHolidaysForTheCurrentYear();
  }
}
