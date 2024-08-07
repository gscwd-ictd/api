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
        BETWEEN NOW() - INTERVAL 6 month AND NOW();
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

  async getWorkSuspensionStart(scheduleTimeOut: string, dtrDate: Date) {
    console.log(
      'pipipopop',
      dayjs(
        (await this.rawQuery(`SELECT get_work_suspension_start(?,?) workSuspensionStart;`, [scheduleTimeOut, null]))[0].workSuspensionStart
      ).isBefore(dayjs())
    );
    return (await this.rawQuery(`SELECT get_work_suspension_start(?,?) workSuspensionStart;`, [scheduleTimeOut, dtrDate]))[0].workSuspensionStart;
  }
}
