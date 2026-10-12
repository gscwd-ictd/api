import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateWorkSuspensionDto, WorkSuspension, WorkSuspensionType } from '@gscwd-api/models';
import { getSuspensionWindow, SuspensionSchedule, SuspensionWindow } from './work-suspension-window.util';
import { HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import dayjs = require('dayjs');

@Injectable()
export class WorkSuspensionService extends CrudHelper<WorkSuspension> {
  constructor(private readonly crudService: CrudService<WorkSuspension>) {
    super(crudService);
  }

  async createWorkSuspension(workSuspensionDto: CreateWorkSuspensionDto) {
    const { suspensionType, suspensionStartTime, ...rest } = workSuspensionDto;
    return await this.crudService.create({
      dto: {
        ...rest,
        suspensionType,
        // only TIME_OF_DAY keeps a start time; new entries never use suspension_hours
        suspensionStartTime: suspensionType === WorkSuspensionType.TIME_OF_DAY ? suspensionStartTime : null,
        suspensionHours: null,
        isArchived: false,
      },
      onError: () => new InternalServerErrorException(),
    });
  }

  /** Active (non-archived) suspension on a date, or null. */
  async getActiveWorkSuspensionByDate(date: Date): Promise<WorkSuspension | null> {
    const rows = (await this.rawQuery(
      `
        SELECT
          work_suspension_id id,
          work_suspension_name \`name\`,
          suspension_date suspensionDate,
          suspension_type suspensionType,
          suspension_start_time suspensionStartTime,
          suspension_hours suspensionHours,
          is_archived isArchived
        FROM work_suspension
        WHERE suspension_date = ? AND is_archived = 0
        LIMIT 1;
      `,
      [dayjs(date).format('YYYY-MM-DD')]
    )) as WorkSuspension[];
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * New-rule suspension window for a schedule on a date. Returns isSuspended = false for
   * LEGACY rows; those keep using get_work_suspension_start / get_work_suspension_hours_*.
   */
  async getSuspensionWindow(date: Date, schedule: SuspensionSchedule): Promise<SuspensionWindow> {
    const suspension = await this.getActiveWorkSuspensionByDate(date);
    return getSuspensionWindow(suspension, schedule);
  }

  async getAllWorkSuspensions() {
    return (
      (await this.rawQuery(`
        SELECT 
            work_suspension_id id, 
            work_suspension_name \`name\`, 
            suspension_date suspensionDate,
            suspension_hours suspensionHours,
            suspension_type suspensionType,
            suspension_start_time suspensionStartTime,
            is_archived isArchived,
            memo_no memoNo,
            remarks
        FROM work_suspension
        WHERE suspension_date 
	> (NOW() - INTERVAL 6 month) AND year(suspension_date) <= year(NOW()) ORDER BY suspension_date DESC;
    `)) as WorkSuspension[]
    ).map((ws) => {
      const { suspensionHours, ...rest } = ws;
      return { suspensionHours: suspensionHours === null ? null : parseFloat(suspensionHours.toString()), ...rest };
    });
  }

  async getLatestWorkSuspensions(): Promise<{ daysFromLatestWorkSuspension: number; suspensionDate: Date }[]> {
    try {
      return await this.rawQuery(`
          SELECT 
            DATEDIFF(now(),suspension_date) daysFromLatestWorkSuspension, 
            DATE_FORMAT(suspension_date, '%Y-%m-%d') suspensionDate
          FROM work_suspension WHERE DATEDIFF(now(),suspension_date) <= 30 
          ORDER BY suspension_date DESC;  
      `);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async getWorkSuspensionBySuspensionDate(suspensionDate: Date) {
    try {
      return parseFloat(
        (
          await this.rawQuery(
            `
              SELECT 
                suspension_hours suspensionHours
              FROM work_suspension 
              WHERE DATE_FORMAT(suspension_date,'%Y-%m-%d') = ?
          `,
            [dayjs(suspensionDate).format('YYYY-MM-DD')]
          )
        )[0].suspensionHours
      );
    } catch (error) {
      return 0;
    }
  }

  async getWorkSuspensionHoursBySuspensionDateAndScheduleTimeOut(scheduleTimeOut: string, dtrDate: Date) {
    //SELECT get_work_suspension_hours_by_date_and_schedule_time_out('2024-07-22', '21:00');
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
