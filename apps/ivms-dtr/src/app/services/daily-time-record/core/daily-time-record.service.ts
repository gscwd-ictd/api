import { CrudHelper, CrudService, throwRpc } from '@gscwd-api/crud';
import { IvmsDailyTimeRecord } from '@gscwd-api/models';
import { DailyTimeRecordPayload, DailyTimeRecordPayloadForSingleEmployee } from '@gscwd-api/utils';
import { Injectable, NotFoundException } from '@nestjs/common';
import dayjs from 'dayjs';

@Injectable()
export class DailyTimeRecordService extends CrudHelper<IvmsDailyTimeRecord> {
  constructor(private readonly crudService: CrudService<IvmsDailyTimeRecord>) {
    super(crudService);
  }

  async getAllDTR() {
    return await this.crudService.findAll({ find: {}, onError: ({ error }) => new NotFoundException(error, { cause: new Error('') }) });
  }

  async getEmployeeDtrByDayAndCompanyId(dailyTimeRecordPayloadForSingleEmployee: DailyTimeRecordPayloadForSingleEmployee) {
    const { companyId, date } = dailyTimeRecordPayloadForSingleEmployee;
    const dateNow = dayjs(date).toDate();

    const dtr = await this.crudService.findAll({
      find: { where: { id: companyId, date: dateNow } },
      onError: ({ error }) => {
        return new NotFoundException(error, { cause: error as Error });
      },
    });
    return dtr;
  }

  async getDtrByCompanyId(dtrPayload: DailyTimeRecordPayload) {
    const { companyId, dtrDates } = dtrPayload;
    const queryString = `
        SELECT [datetime]
              ,[time]
              ,[status]
              ,[device]
              ,[deviceno]
              ,[empname]
              ,[cardno]
              ,[ID]
              ,[date]
              ,[dtr_id]
          FROM [ivmsdb].[dbo].[atteninfo] 
          WHERE cardno = '2018061' AND date='2023-03-07' 
          ORDER BY cardno DESC,time ASC;`;

    const queryString2 = `
        SELECT DISTINCT FORMAT(atteninfo.datetime, 'HH:mm') AS 'time24Hr',
            FORMAT(atteninfo.datetime,'hh:mm tt') AS 'time12Hr' 
        FROM atteninfo WHERE atteninfo.date = @0 AND atteninfo.ID = @1`;
    //,[dtrDate,companyId]
    const dtrDatesResults = await Promise.all(
      dtrDates.map(async (dtrDate) => {
        const employeeDtr = await this.rawQuery(queryString);
        return { dtrDate, employeeDtr };
      })
    );
    return { companyId, dtrDatesResults };
  }
}
