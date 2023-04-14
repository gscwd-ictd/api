import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Holidays, HolidaysDto } from '@gscwd-api/models';
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
}
