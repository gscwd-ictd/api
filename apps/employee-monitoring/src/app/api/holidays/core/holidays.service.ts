import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Holidays, HolidaysDto, UpdateHolidayDto } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class HolidaysService extends CrudHelper<Holidays> {
  constructor(private readonly crudService: CrudService<Holidays>) {
    super(crudService);
  }

  async getHolidaysForTheCurrentYear() {
    return await this.rawQuery(
      `SELECT holiday_id id, 
              name, 
              date_format(holiday_date,'%M %d, %Y') holidayDate, 
              type FROM holidays 
      WHERE year(holiday_date) = year(now()) 
      ORDER BY holiday_date ASC`
    );
  }

  async addHoliday(holidaysDto: HolidaysDto) {
    return await this.crudService.create({
      dto: holidaysDto,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });
  }

  async getHoliday(id: string) {
    return await this.crudService.findOne({
      find: { where: { id } },
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });
  }

  async updateHoliday(updateHolidayDto: UpdateHolidayDto) {
    const { id, ...rest } = updateHolidayDto;
    const updateHolidayResult = await this.crudService.update({
      dto: rest,
      updateBy: { id },
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });
    if (updateHolidayResult.affected > 0) return updateHolidayDto;
  }

  async deleteHoliday(id: string) {
    const holiday = await this.getHoliday(id);
    const deleteResult = await this.crudService.delete({
      deleteBy: { id },
      softDelete: false,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });
    if (deleteResult.affected > 0) return holiday;
  }
}
