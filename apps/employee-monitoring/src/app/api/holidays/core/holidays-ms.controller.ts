import { HolidaysDto } from '@gscwd-api/models';
import { Controller } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { HolidaysService } from './holidays.service';

@Controller('holiday')
export class HolidaysMsController {
  constructor(private readonly holidaysService: HolidaysService) {}

  @MessagePattern('add_holiday')
  async addHoliday(holidaysDto: HolidaysDto) {
    return await this.holidaysService.addHoliday(holidaysDto);
  }

  @MessagePattern({ msg: 'get_holidays_for_the_year' })
  async getHoliday() {
    try {
      return await this.holidaysService.getHolidaysForTheCurrentYear();
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
