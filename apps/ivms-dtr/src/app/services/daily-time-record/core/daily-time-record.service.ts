import { CrudHelper, CrudService, throwRpc } from '@gscwd-api/crud';
import { IvmsDailyTimeRecord } from '@gscwd-api/models';
import { DailyTimeRecordPayload, DailyTimeRecordPayloadForSingleEmployee } from '@gscwd-api/utils';
import { Injectable, NotFoundException } from '@nestjs/common';
import dayjs from 'dayjs';

/**
 * The face scan database (SQL Server datetime) only holds years 1753-9999. Overtime / schedule dates typed with a
 * wrong year (0005, 0026, 0206, ...) failed every lookup with "Validation failed for parameter '1'. Invalid date."
 */
function isFaceScanDate(value: unknown): boolean {
  const d = dayjs(value as string);
  return d.isValid() && d.year() >= 1900 && d.year() <= 2100;
}

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
    // a date the face scan database cannot hold (e.g. a typo year 0026) has no face scans
    if (!isFaceScanDate(date)) return [];
    const dateNow = dayjs(date).toDate();

    const dtr = await this.crudService.findAll({
      find: { where: { id: companyId, date: dateNow }, order: { time: 'ASC' } },
      onError: ({ error }) => {
        return new NotFoundException(error, { cause: error as Error });
      },
    });
    return dtr;
  }

  async getEntriesTheDayAndTheNext(entry: { companyId: string; date: Date }) {
    const { companyId, date } = entry;
    if (!isFaceScanDate(date)) return [];
    const trimmedCompanyId = companyId.replace('-', '');

    const entries = (await this.rawQuery(
      `SELECT format([datetime],'MM/dd/yyyy hh:mm:ss tt') "time"
          FROM [ivmsdb].[dbo].[Atteninfo] WHERE (
            ID=@0 AND datetime BETWEEN @1 AND DATEADD(day,2,@1) 
        ) order by datetime ASC;`,
      [trimmedCompanyId, date]
    )) as { time: Date }[];
    return entries.map((entry) => entry.time);
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

  async getHasDtr(data: { companyId: string; entryDate: Date }) {
    const { companyId, entryDate } = data;

    if (dayjs(entryDate).isAfter(dayjs())) return null;
    if (!isFaceScanDate(entryDate)) return false;

    const hasData = (await this.rawQuery(`SELECT count(ID) countAttendance FROM atteninfo WHERE ID = @0 AND date = @1;`, [companyId, entryDate]))[0]
      .countAttendance;

    return parseInt(hasData) > 0 ? true : false;
  }
}
