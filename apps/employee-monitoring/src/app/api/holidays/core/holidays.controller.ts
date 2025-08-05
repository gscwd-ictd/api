import { HolidaysDto, UpdateHolidayDto } from '@gscwd-api/models';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
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

  @Get('/:holiday_date')
  async addBackFromHoliday(@Param('holiday_date') holidayDate: Date) {
    return await this.holidayService.addBackFromHoliday(holidayDate);
  }

  @Put()
  async updateHoliday(@Body() updateHolidayDto: UpdateHolidayDto) {
    return await this.holidayService.updateHoliday(updateHolidayDto);
  }

  @Delete(':holiday_id')
  async deleteHoliday(@Param('holiday_id') id: string) {
    return await this.holidayService.deleteHoliday(id);
  }
}
