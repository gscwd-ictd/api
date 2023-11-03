import { Holidays, HolidaysDto, UpdateHolidayDto } from '@gscwd-api/models';
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserLogsInterceptor } from '../../user-logs/misc/interceptors/user-logs.interceptor';
import { AuthenticatedGuard } from '../../users/guards/authenticated.guard';
import { HolidaysService } from './holidays.service';

@UseInterceptors(UserLogsInterceptor<Holidays>)
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

  @UseGuards(AuthenticatedGuard)
  @Get('asd')
  async testGuard() {
    return 'working guard';
  }

  @Put()
  async updateHoliday(@Body() updateHolidayDto: UpdateHolidayDto) {
    return await this.holidayService.updateHoliday(updateHolidayDto);
  }

  @Delete(':holiday_id')
  async deleteHoliday(@Param('holiday_id') id: string) {
    return await this.holidayService.deleteHoliday(id);
  }

  @Post('testing')
  async addRegularHolidaysForCurrentYear() {
    return await this.holidayService.addRegularHolidaysForCurrentYear();
  }
}
