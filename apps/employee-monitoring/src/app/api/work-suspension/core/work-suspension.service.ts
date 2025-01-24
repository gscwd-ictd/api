import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateWorkSuspensionDto, WorkSuspension } from '@gscwd-api/models';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import dayjs = require('dayjs');

@Injectable()
export class WorkSuspensionService extends CrudHelper<WorkSuspension> {
  constructor(private readonly crudService: CrudService<WorkSuspension>) {
    super(crudService);
  }

  async createWorkSuspension(workSuspensionDto: CreateWorkSuspensionDto) {
    return await this.crudService.create({ dto: workSuspensionDto, onError: () => new InternalServerErrorException() });
  }

  async getAllWorkSuspensions() {
    return (
      (await this.rawQuery(`
        SELECT 
            work_suspension_id id, 
            work_suspension_name \`name\`, 
            suspension_date suspensionDate,
            suspension_hours suspensionHours 
        FROM work_suspension
        WHERE suspension_date 
	> (NOW() - INTERVAL 6 month) AND year(suspension_date) <= year(NOW()) ORDER BY suspension_date DESC;
    `)) as WorkSuspension[]
    ).map((ws) => {
      const { suspensionHours, ...rest } = ws;
      return { suspensionHours: parseFloat(suspensionHours.toString()), ...rest };
    });
  }

  async getWorkSuspensionBySuspensionDate(suspensionDate: Date) {
    //
    try {
      return parseFloat(
        (
          await this.rawQuery(
            `
              SELECT 
                  suspension_hours suspensionHours
              FROM work_suspension 
              WHERE suspension_date = ?
          `,
            [suspensionDate]
          )
        )[0].suspensionHours
      );
    } catch (error) {
      return 0;
    }
  }

  async getWorkSuspensionHoursBySuspensionDateAndScheduleTimeOut(scheduleTimeOut: string, dtrDate: Date) {
    return (
      await this.rawQuery(
        `
        SELECT get_work_suspension_hours_by_date_and_schedule_time_out(?, ?) suspensionHours;
      `,
        [dayjs(dtrDate).format('YYYY-MM-DD'), scheduleTimeOut]
      )
    )[0].suspensionHours;
  }

  async getWorkSuspensionStart(scheduleTimeOut: string, dtrDate: Date) {
    return (await this.rawQuery(`SELECT get_work_suspension_start(?,?) workSuspensionStart;`, [scheduleTimeOut, dtrDate]))[0].workSuspensionStart;
  }
}
