import { HolidaysDto } from '@gscwd-api/models';
import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { HolidaysService } from './holidays.service';
import { MsExceptionFilter } from '@gscwd-api/utils';

@Controller('holiday')
export class HolidaysMsController {
  constructor(private readonly holidaysService: HolidaysService) { }

  @UseFilters(new MsExceptionFilter())
  @MessagePattern('add_holiday')
  async addHoliday(holidaysDto: HolidaysDto) {
    try {
      return await this.holidaysService.addHoliday(holidaysDto);
    }
    catch (error) {
      throw new RpcException(error.message);
    }

  }


  @UseFilters(new MsExceptionFilter())
  @MessagePattern({ msg: 'get_holidays_for_the_year' })
  async getHoliday() {
    try {
      return await this.holidaysService.getHolidaysForTheCurrentYear();
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
