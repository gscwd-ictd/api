import { NatureOfBusiness } from '@gscwd-api/utils';

/** Minutes in one working day; leave credit = deductible minutes / 480. */
export const MINUTES_PER_DAY = 480;
/** Half Day base deduction (4 hours). */
export const HALF_DAY_MINUTES = 240;
/** Wellness Pass free allowance per quarter (4 hours). */
export const WELLNESS_ALLOWANCE_MINUTES = 240;

export type ScheduleWindow = {
  timeIn: string; // 'HH:mm[:ss]'
  timeOut: string;
  lunchOut?: string | null; // lunch break start
  lunchIn?: string | null; // lunch break end
};

/** 'HH:mm[:ss]' -> minutes since midnight. Seconds are dropped. */
export function toMinutes(time: string | null | undefined): number | null {
  if (time === null || time === undefined || time === '') return null;
  const [h, m] = time.toString().split(':');
  const hours = parseInt(h, 10);
  const minutes = parseInt(m, 10);
  if (isNaN(hours) || isNaN(minutes)) return null;
  return hours * 60 + minutes;
}

/**
 * Lunch break of the schedule. If no lunch break is assigned, it starts 4 hours
 * after the scheduled time in and lasts 1 hour.
 */
export function getLunchBreak(schedule: ScheduleWindow): { start: number; end: number } {
  const lunchOut = toMinutes(schedule.lunchOut);
  const lunchIn = toMinutes(schedule.lunchIn);
  // a lunch break longer than 3 hours is treated as bad schedule data (e.g. lunch_in 23:31)
  if (lunchOut !== null && lunchIn !== null && lunchIn > lunchOut && lunchIn - lunchOut <= 180) return { start: lunchOut, end: lunchIn };
  const start = toMinutes(schedule.timeIn) + 240;
  return { start, end: start + 60 };
}

/** Minutes of [aStart,aEnd] that overlap [bStart,bEnd]. */
export function overlapMinutes(aStart: number, aEnd: number, bStart: number, bEnd: number): number {
  return Math.max(0, Math.min(aEnd, bEnd) - Math.max(aStart, bStart));
}

/** Minutes between out and in, excluding the part that falls inside the lunch break. */
export function minutesOutsideLunch(out: number, back: number, schedule: ScheduleWindow): number {
  if (back <= out) return 0;
  const lunch = getLunchBreak(schedule);
  return back - out - overlapMinutes(out, back, lunch.start, lunch.end);
}

/** Convert minutes to leave credits, rounded UP to 3 decimal places. */
export function minutesToCredits(minutes: number): number {
  if (minutes <= 0) return 0;
  // toFixed guards against float noise (e.g. 0.0625 * 1000 = 62.50000000001)
  return Math.ceil(Number(((minutes / MINUTES_PER_DAY) * 1000).toFixed(6))) / 1000;
}

export type DeductionInput = {
  natureOfBusiness: NatureOfBusiness;
  timeOut: string | null;
  timeIn: string | null;
  schedule: ScheduleWindow;
  /** Wellness Pass only: minutes already used by earlier Wellness Passes in the same quarter. */
  wellnessMinutesUsedThisQuarter?: number;
};

/** Raw minutes a pass slip consumed (lunch excluded), before any Wellness allowance. */
export function computeUsedMinutes(input: DeductionInput): number {
  const { natureOfBusiness, schedule } = input;
  const out = toMinutes(input.timeOut);
  const scheduleOut = toMinutes(schedule.timeOut);
  if (out === null) return 0;

  switch (natureOfBusiness) {
    case NatureOfBusiness.PERSONAL:
    case NatureOfBusiness.WELLNESS_PASS: {
      // no pass slip IN -> schedule time out is used
      const back = toMinutes(input.timeIn) ?? scheduleOut;
      return minutesOutsideLunch(out, back, schedule);
    }
    case NatureOfBusiness.UNDERTIME:
      return minutesOutsideLunch(out, scheduleOut, schedule);
    default:
      return 0;
  }
}

/** Deductible minutes to be charged to the leave ledger. */
export function computeDeductibleMinutes(input: DeductionInput): number {
  const { natureOfBusiness, schedule } = input;
  const out = toMinutes(input.timeOut);

  switch (natureOfBusiness) {
    case NatureOfBusiness.OFFICIAL_BUSINESS:
      return 0;
    case NatureOfBusiness.HALF_DAY: {
      // automatic 0.500; plus any time out before the lunch break (the half day starts after lunch)
      const lunch = getLunchBreak(schedule);
      const early = out !== null ? Math.max(0, lunch.start - out) : 0;
      return HALF_DAY_MINUTES + early;
    }
    case NatureOfBusiness.WELLNESS_PASS: {
      const used = Math.max(0, input.wellnessMinutesUsedThisQuarter ?? 0);
      const current = computeUsedMinutes(input);
      const remainingAllowance = Math.max(0, WELLNESS_ALLOWANCE_MINUTES - used);
      return Math.max(0, current - remainingAllowance);
    }
    case NatureOfBusiness.PERSONAL:
    case NatureOfBusiness.UNDERTIME:
      return computeUsedMinutes(input);
    default:
      return 0;
  }
}

/** First day of the quarter (YYYY-MM-DD) for a date. */
export function quarterStart(date: Date | string): string {
  const d = new Date(date);
  const month = Math.floor(d.getMonth() / 3) * 3;
  return `${d.getFullYear()}-${String(month + 1).padStart(2, '0')}-01`;
}

/**
 * Counts pass slips that already account for the employee leaving early on a date, so the DTR
 * undertime / half day deduction must NOT also be applied (prevents double deduction when the
 * employee scans out on both the phone app and the face scanner).
 *
 * A pass slip "covers" the DTR time out when it has a pass slip OUT and either:
 *  - it is Undertime or Half Day, or
 *  - the employee never scanned back IN (Personal Business / Wellness Pass), or the IN was
 *    auto-filled with the schedule time out.
 * Params: [employeeId, 'YYYY-MM-DD', companyId]
 */
export const PASS_SLIP_COVERS_DTR_TIME_OUT_SQL = `
  SELECT COUNT(ps.pass_slip_id) passSlipCount
    FROM pass_slip ps
   INNER JOIN pass_slip_approval psa ON psa.pass_slip_id_fk = ps.pass_slip_id
    LEFT JOIN daily_time_record dtr ON dtr.company_id_fk = ?
          AND DATE_FORMAT(dtr.dtr_date,'%Y-%m-%d') = DATE_FORMAT(ps.date_of_application,'%Y-%m-%d')
    LEFT JOIN schedule s ON s.schedule_id = dtr.schedule_id_fk
   WHERE ps.employee_id_fk = ?
     AND DATE_FORMAT(ps.date_of_application,'%Y-%m-%d') = ?
     AND ps.time_out IS NOT NULL
     AND psa.status IN ('approved','approved with medical certificate','approved without medical certificate',
                        'awaiting medical certificate','for dispute')
     AND (
          ps.nature_of_business IN ('Undertime','Half Day')
       OR (ps.nature_of_business IN ('Personal Business','Wellness Pass')
           AND (ps.time_in IS NULL OR (s.time_out IS NOT NULL AND ps.time_in >= s.time_out)))
     );`;
