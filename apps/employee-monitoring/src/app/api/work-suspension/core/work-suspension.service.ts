import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateWorkSuspensionDto, UpdateWorkSuspensionDto, WorkSuspension, WorkSuspensionType } from '@gscwd-api/models';
import { getSuspensionWindow, SuspensionSchedule, SuspensionWindow } from './work-suspension-window.util';
import { toSortingSuspension } from './work-suspension-dtr.util';
import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import dayjs = require('dayjs');

export type WorkSuspensionListFilter = {
  from?: string;
  to?: string;
  includeArchived?: boolean;
};

export type WorkSuspensionPreviewRow = {
  scheduleId: string;
  scheduleName: string;
  timeIn: string;
  timeOut: string;
  lunchOut: string | null;
  lunchIn: string | null;
  shift: string | null;
} & Pick<SuspensionWindow, 'suspendedMinutes' | 'fraction' | 'ndSuspendedMinutes'>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

const SELECT_COLUMNS = `
  work_suspension_id id,
  work_suspension_name \`name\`,
  DATE_FORMAT(suspension_date, '%Y-%m-%d') suspensionDate,
  suspension_type suspensionType,
  suspension_start_time suspensionStartTime,
  suspension_hours suspensionHours,
  is_archived isArchived,
  memo_no memoNo,
  remarks
`;

@Injectable()
export class WorkSuspensionService extends CrudHelper<WorkSuspension> {
  constructor(private readonly crudService: CrudService<WorkSuspension>) {
    super(crudService);
  }

  // ---------------------------------------------------------------- helpers

  private static toDateString(date: Date | string): string {
    return dayjs(date).format('YYYY-MM-DD');
  }

  private static normalizeTime(time: string | null | undefined): string | null {
    if (!time) return null;
    return time.length === 5 ? `${time}:00` : time;
  }

  private static mapRow(row: Record<string, unknown>): WorkSuspension {
    const hours = row.suspensionHours;
    return {
      ...row,
      suspensionHours: hours === null || hours === undefined ? null : parseFloat(String(hours)),
      isArchived: row.isArchived === 1 || row.isArchived === '1' || row.isArchived === true,
    } as unknown as WorkSuspension;
  }

  private async getById(id: string): Promise<WorkSuspension> {
    const rows: Row[] = await this.rawQuery(`SELECT ${SELECT_COLUMNS} FROM work_suspension WHERE work_suspension_id = ?;`, [id]);
    if (rows.length === 0) throw new NotFoundException('Work suspension not found.');
    return WorkSuspensionService.mapRow(rows[0]);
  }

  /** One active (non-archived) suspension per date. */
  private async assertNoActiveSuspensionOnDate(date: string, exceptId?: string) {
    const rows: Row[] = await this.rawQuery(
      `SELECT work_suspension_id id FROM work_suspension
       WHERE suspension_date = ? AND is_archived = 0 ${exceptId ? 'AND work_suspension_id <> ?' : ''} LIMIT 1;`,
      exceptId ? [date, exceptId] : [date]
    );
    if (rows.length > 0) throw new ConflictException(`There is already an active work suspension on ${date}.`);
  }

  private static assertStartTime(type: WorkSuspensionType, startTime: string | null) {
    if (type === WorkSuspensionType.LEGACY) throw new BadRequestException('LEGACY suspensions cannot be created or edited.');
    if (type === WorkSuspensionType.TIME_OF_DAY && !startTime)
      throw new UnprocessableEntityException('suspensionStartTime is required for a time of day suspension.');
  }

  // ---------------------------------------------------------------- CRUD

  async createWorkSuspension(workSuspensionDto: CreateWorkSuspensionDto) {
    const { suspensionType, suspensionStartTime, suspensionDate, name, memoNo, remarks } = workSuspensionDto;
    const startTime = suspensionType === WorkSuspensionType.TIME_OF_DAY ? WorkSuspensionService.normalizeTime(suspensionStartTime) : null;
    WorkSuspensionService.assertStartTime(suspensionType, startTime);

    const date = WorkSuspensionService.toDateString(suspensionDate);
    await this.assertNoActiveSuspensionOnDate(date);

    return await this.crudService.create({
      dto: {
        name,
        suspensionDate: date as unknown as Date,
        suspensionType,
        suspensionStartTime: startTime,
        suspensionHours: null, // new entries never use suspension_hours
        isArchived: false,
        memoNo: memoNo ?? null,
        remarks: remarks ?? null,
      },
      onError: (error) => new InternalServerErrorException(error),
    });
  }

  async updateWorkSuspension(id: string, updateDto: UpdateWorkSuspensionDto) {
    const existing = await this.getById(id);
    if (existing.isArchived || existing.suspensionType === WorkSuspensionType.LEGACY)
      throw new ConflictException('Archived work suspensions are read-only.');

    const suspensionType = updateDto.suspensionType ?? existing.suspensionType;
    const startTime =
      suspensionType === WorkSuspensionType.TIME_OF_DAY
        ? WorkSuspensionService.normalizeTime(updateDto.suspensionStartTime ?? existing.suspensionStartTime)
        : null;
    WorkSuspensionService.assertStartTime(suspensionType, startTime);

    const date = WorkSuspensionService.toDateString(updateDto.suspensionDate ?? existing.suspensionDate);
    await this.assertNoActiveSuspensionOnDate(date, id);

    await this.crudService.update({
      dto: {
        name: updateDto.name ?? existing.name,
        suspensionDate: date as unknown as Date,
        suspensionType,
        suspensionStartTime: startTime,
        memoNo: updateDto.memoNo ?? existing.memoNo,
        remarks: updateDto.remarks ?? existing.remarks,
      },
      updateBy: { id },
      onError: (error) => new InternalServerErrorException(error),
    });

    // TODO step 4: adjust leave add-backs for the changed suspension (work_suspension_id FK)
    return { previous: existing, updated: await this.getById(id) };
  }

  async deleteWorkSuspension(id: string) {
    const existing = await this.getById(id);
    if (existing.isArchived || existing.suspensionType === WorkSuspensionType.LEGACY)
      throw new ConflictException('Archived work suspensions are read-only.');

    // TODO step 4: reverse leave add-backs credited for this suspension before deleting
    await this.crudService.delete({ deleteBy: { id }, softDelete: false, onError: (error) => new InternalServerErrorException(error) });
    return existing;
  }

  async getAllWorkSuspensions(filter: WorkSuspensionListFilter = {}) {
    const where: string[] = [];
    const params: unknown[] = [];

    if (filter.from || filter.to) {
      if (filter.from) {
        where.push('suspension_date >= ?');
        params.push(WorkSuspensionService.toDateString(filter.from));
      }
      if (filter.to) {
        where.push('suspension_date <= ?');
        params.push(WorkSuspensionService.toDateString(filter.to));
      }
    } else {
      // previous default: last 6 months up to the end of the current year
      where.push('suspension_date > (NOW() - INTERVAL 6 MONTH) AND YEAR(suspension_date) <= YEAR(NOW())');
    }
    if (filter.includeArchived === false) where.push('is_archived = 0');

    const rows: Row[] = await this.rawQuery(
      `SELECT ${SELECT_COLUMNS} FROM work_suspension ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY suspension_date DESC;`,
      params
    );
    return rows.map((row) => WorkSuspensionService.mapRow(row));
  }

  // ---------------------------------------------------------------- preview

  /** Suspended minutes / f / ND minutes for every schedule, so HR can check a suspension before saving it. */
  async previewWorkSuspension(suspensionType: WorkSuspensionType, suspensionStartTime?: string): Promise<WorkSuspensionPreviewRow[]> {
    const startTime = suspensionType === WorkSuspensionType.TIME_OF_DAY ? WorkSuspensionService.normalizeTime(suspensionStartTime) : null;
    if (!Object.values(WorkSuspensionType).includes(suspensionType)) throw new BadRequestException('Invalid suspensionType.');
    WorkSuspensionService.assertStartTime(suspensionType, startTime);

    const schedules = (await this.rawQuery(
      `SELECT schedule_id scheduleId, name scheduleName, time_in timeIn, time_out timeOut, lunch_out lunchOut, lunch_in lunchIn, shift
       FROM schedule ORDER BY time_in, name;`
    )) as (SuspensionSchedule & { scheduleId: string; scheduleName: string; shift: string | null })[];

    return schedules.map((schedule) => {
      const window = getSuspensionWindow({ suspensionType, suspensionStartTime: startTime }, schedule);
      return {
        ...schedule,
        lunchOut: schedule.lunchOut ?? null,
        lunchIn: schedule.lunchIn ?? null,
        suspendedMinutes: window.suspendedMinutes,
        fraction: window.fraction,
        ndSuspendedMinutes: window.ndSuspendedMinutes,
      };
    });
  }

  // ---------------------------------------------------------------- used by DTR / leave / OT

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

  /**
   * LEGACY suspension hours for a date (0 when there is none).
   * New WHOLE_DAY / TIME_OF_DAY rows have no hours; their callers move to getSuspensionWindow in steps 3–5.
   */
  async getWorkSuspensionBySuspensionDate(suspensionDate: Date) {
    const rows: Row[] = await this.rawQuery(
      `
        SELECT suspension_hours suspensionHours
        FROM work_suspension
        WHERE suspension_date = ? AND suspension_type = 'LEGACY' AND suspension_hours IS NOT NULL
        LIMIT 1;
      `,
      [dayjs(suspensionDate).format('YYYY-MM-DD')]
    );
    return rows.length === 0 ? 0 : parseFloat(rows[0].suspensionHours);
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

  /** Active (non-archived) suspension on a date, or null. */
  async getActiveWorkSuspensionByDate(date: Date): Promise<WorkSuspension | null> {
    const rows: Row[] = await this.rawQuery(`SELECT ${SELECT_COLUMNS} FROM work_suspension WHERE suspension_date = ? AND is_archived = 0 LIMIT 1;`, [
      dayjs(date).format('YYYY-MM-DD'),
    ]);
    return rows.length > 0 ? WorkSuspensionService.mapRow(rows[0]) : null;
  }

  /**
   * New-rule suspension window for a schedule on a date. Returns isSuspended = false for
   * LEGACY rows; those keep using get_work_suspension_start / get_work_suspension_hours_*.
   */
  async getSuspensionWindow(date: Date, schedule: SuspensionSchedule): Promise<SuspensionWindow> {
    const suspension = await this.getActiveWorkSuspensionByDate(date);
    return getSuspensionWindow(suspension, schedule);
  }

  /**
   * Hours + start used by the DTR punch-sorting code (scans after "time out − hours" become time out).
   * LEGACY: the old values (suspension_hours + get_work_suspension_start). New rows: derived from the
   * suspension window, so the sorting code keeps working unchanged. Start is 'YYYY-MM-DD HH:mm:ss' or null.
   */
  async getSortingSuspension(date: Date | string, schedule: SuspensionSchedule): Promise<{ suspensionHours: number; workSuspensionStart: string | null }> {
    const dateString = dayjs(date).format('YYYY-MM-DD');
    const legacyHours = await this.getWorkSuspensionBySuspensionDate(dayjs(dateString).toDate());
    if (legacyHours > 0) {
      return { suspensionHours: legacyHours, workSuspensionStart: await this.getWorkSuspensionStart(schedule.timeOut, dateString as unknown as Date) };
    }
    const { suspensionHours, startMinutes } = toSortingSuspension(await this.getSuspensionWindow(dayjs(dateString).toDate(), schedule), schedule);
    if (startMinutes === null) return { suspensionHours: 0, workSuspensionStart: null };
    return {
      suspensionHours,
      workSuspensionStart: dayjs(dateString).startOf('day').add(startMinutes, 'minute').format('YYYY-MM-DD HH:mm:ss'),
    };
  }

  /** { type, startTime } of the active new-rule suspension on a date (for the DTR table / PDF marker), else null. */
  async getWorkSuspensionMarker(date: Date | string): Promise<{ id: string; name: string; type: WorkSuspensionType; startTime: string | null } | null> {
    const suspension = await this.getActiveWorkSuspensionByDate(dayjs(date).toDate());
    if (!suspension || suspension.suspensionType === WorkSuspensionType.LEGACY) return null;
    return { id: suspension.id, name: suspension.name, type: suspension.suspensionType, startTime: suspension.suspensionStartTime };
  }
}
