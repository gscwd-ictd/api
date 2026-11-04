import dayjs = require('dayjs');

/**
 * Report on Attendance, computed exactly like the employee's DTR page summary:
 *  - lates, undertimes and half days per day come from DailyTimeRecordService.getLatesUndertimesNoAttendancePerDay
 *    (a half day morning absence counts as a late, like on the DTR page)
 *  - total minutes = minutes late + minutes undertime
 *  - conversion = CSC conversion of the total minutes (hours x 0.125 + minutes table)
 *  - Date/s (Late & Undertime) = late dates (incl. half day morning) + undertime dates
 *  - no attendance = scheduled working days (not a rest day, holiday, whole-day work suspension, approved leave,
 *    travel order, HR remark on the DTR, or after separation) without any time log
 * Only DTR days that can have a late / undertime / half day are evaluated (candidateDaysSql), so the report stays fast.
 */

export type DaySummary = {
  minutesLate: number;
  noOfLates: number;
  noOfUndertimes: number;
  minutesUndertime: number;
  noAttendance: number;
  isHalfDay: boolean;
};

export type CandidateDayRow = { companyId: string; dtrDate: string };

export type NoAttendanceRow = { companyId: string; noAttendance: string | null; noAttendanceCount: number | string };

export type AttendanceReportItem = {
  employeeId: string;
  companyId: string;
  name: string;
  numberOfTimesLate: number;
  datesLate: string;
  totalMinutesLate: number;
  numberOfTimesUndertime: number;
  datesUndertime: string;
  totalMinutesUndertime: number;
  totalMinutesLateUndertime: number;
  conversion: string;
  numberOfTimesHalfDay: number;
  daysHalfDay: string;
  noAttendance: string;
  numberOfNoAttendance: number;
};

const ymd = (d: Date | string) => dayjs(d).format('YYYY-MM-DD');

/**
 * DTR days that may have a late, undertime or half day: missing time in / time out, time in after the schedule,
 * time out before the schedule, or lunch in after the 30-minute allowance. Params: [dateFrom, dateTo, companyIds].
 */
export function candidateDaysSql() {
  return `
  SELECT DISTINCT d.company_id_fk companyId, DATE_FORMAT(d.dtr_date, '%Y-%m-%d') dtrDate
    FROM daily_time_record d
    LEFT JOIN schedule s ON s.schedule_id = d.schedule_id_fk
   WHERE d.dtr_date >= ? AND d.dtr_date <= ? AND d.company_id_fk IN (?)
     AND (d.time_in IS NULL OR d.time_out IS NULL OR s.schedule_id IS NULL
          OR d.time_in > s.time_in OR d.time_out < s.time_out
          OR (s.lunch_in IS NOT NULL AND d.lunch_in > ADDTIME(s.lunch_in, '00:29:00')));`;
}

export function candidateDaysParams(dateFrom: Date | string, dateTo: Date | string, companyIds: string[]) {
  return [ymd(dateFrom), ymd(dateTo), companyIds];
}

/** CSC conversion of minutes to leave credits: whole hours x 0.125 plus the minutes table (minutes x 0.125 / 60, 3 decimals). */
export function cscConversion(totalMinutes: number): number {
  if (!totalMinutes || totalMinutes <= 0) return 0;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const minuteCredits = Math.round(((minutes * 0.125) / 60) * 1000) / 1000;
  return Math.round((hours * 0.125 + minuteCredits) * 1000) / 1000;
}

/** Working days without any time log. Params: [dateFrom, dateTo, companyIds]. */
export function noAttendanceSql(hrms = process.env.HRMS_DB_NAME ?? '') {
  return `
  WITH RECURSIVE days AS (
    SELECT CAST(? AS DATE) d, CAST(? AS DATE) dTo
    UNION ALL SELECT d + INTERVAL 1 DAY, dTo FROM days WHERE d < dTo
  )
  SELECT e.company_id companyId, COUNT(*) noAttendanceCount,
         GROUP_CONCAT(DATE_FORMAT(days.d, '%Y-%m-%d') ORDER BY days.d SEPARATOR ', ') noAttendance
    FROM ${hrms}employees e
    JOIN days
   WHERE e.company_id IN (?)
     AND days.d <= CURDATE()
     AND EXISTS (SELECT 1 FROM employee_schedule es
                  WHERE es.employee_id_fk = e._id AND es.deleted_at IS NULL AND days.d BETWEEN es.date_from AND es.date_to)
     AND NOT EXISTS (SELECT 1 FROM employee_rest_day erd
                       INNER JOIN employee_rest_days erds ON erds.employee_rest_day_id_fk = erd.employee_rest_day_id
                      WHERE erd.employee_id_fk = e._id AND days.d BETWEEN erd.date_from AND erd.date_to
                        AND DATE_FORMAT(days.d, '%w') = erds.rest_day)
     AND NOT EXISTS (SELECT 1 FROM holidays h WHERE h.holiday_date = days.d)
     AND NOT EXISTS (SELECT 1 FROM work_suspension ws
                      WHERE ws.suspension_date = days.d AND ws.deleted_at IS NULL
                        AND (ws.suspension_type = 'WHOLE_DAY' OR ws.suspension_hours >= 8))
     AND NOT EXISTS (SELECT 1 FROM leave_application la
                       INNER JOIN leave_application_dates lad ON lad.leave_application_id_fk = la.leave_application_id
                      WHERE la.employee_id_fk = e._id AND lad.leave_date = days.d AND la.status = 'approved' AND lad.status = 'approved')
     AND NOT EXISTS (SELECT 1 FROM travel_order t
                       INNER JOIN travel_order_itinerary ti ON ti.travel_order_id_fk = t.travel_order_id
                      WHERE t.employee_id_fk = e._id AND ti.schedule_date = days.d)
     AND NOT EXISTS (SELECT 1 FROM daily_time_record dtr
                      WHERE dtr.company_id_fk = e.company_id AND dtr.dtr_date = days.d
                        AND (dtr.time_in IS NOT NULL OR dtr.lunch_out IS NOT NULL OR dtr.lunch_in IS NOT NULL OR dtr.time_out IS NOT NULL
                             OR COALESCE(dtr.remarks, '') <> ''))
     AND NOT EXISTS (SELECT 1 FROM ${hrms}nosi_nosa nn
                      WHERE nn.employee_id_fk = e._id AND nn.status = 'inactive' AND nn.effectivity_date <= days.d
                        AND nn.effectivity_date = (SELECT MAX(nn2.effectivity_date) FROM ${hrms}nosi_nosa nn2 WHERE nn2.employee_id_fk = e._id))
   GROUP BY e.company_id;`;
}

export function noAttendanceParams(dateFrom: Date | string, dateTo: Date | string, companyIds: string[]) {
  return [ymd(dateFrom), ymd(dateTo), companyIds];
}

export function buildAttendanceReport(
  employees: { employeeId: string; companyId: string; name: string }[],
  days: { companyId: string; dtrDate: string; summary: DaySummary | null }[],
  noAttendance: NoAttendanceRow[]
): AttendanceReportItem[] {
  const byCompany = new Map<string, { companyId: string; dtrDate: string; summary: DaySummary }[]>();
  for (const day of days) {
    if (!day.summary) continue;
    const list = byCompany.get(day.companyId) ?? [];
    list.push(day as { companyId: string; dtrDate: string; summary: DaySummary });
    byCompany.set(day.companyId, list);
  }
  const absent = new Map(noAttendance.map((r) => [r.companyId, r]));

  return employees
    .map(({ employeeId, companyId, name }) => {
      const list = (byCompany.get(companyId) ?? []).sort((a, b) => a.dtrDate.localeCompare(b.dtrDate));
      let numberOfTimesLate = 0;
      let totalMinutesLate = 0;
      let numberOfTimesUndertime = 0;
      let totalMinutesUndertime = 0;
      const lateDates: string[] = [];
      const undertimeDates: string[] = [];
      const halfDayDates: string[] = [];
      for (const { dtrDate, summary } of list) {
        const lates = Number(summary.noOfLates ?? 0);
        const undertimes = Number(summary.noOfUndertimes ?? 0);
        numberOfTimesLate += lates;
        totalMinutesLate += Math.max(0, Number(summary.minutesLate ?? 0));
        numberOfTimesUndertime += undertimes;
        totalMinutesUndertime += Math.max(0, Number(summary.minutesUndertime ?? 0));
        if (lates > 0) lateDates.push(dtrDate);
        if (undertimes > 0) undertimeDates.push(dtrDate);
        if (summary.isHalfDay) halfDayDates.push(dtrDate);
      }
      const totalMinutesLateUndertime = totalMinutesLate + totalMinutesUndertime;
      const na = absent.get(companyId);
      return {
        employeeId,
        companyId,
        name,
        numberOfTimesLate,
        datesLate: lateDates.join(', '),
        totalMinutesLate,
        numberOfTimesUndertime,
        datesUndertime: undertimeDates.join(', '),
        totalMinutesUndertime,
        totalMinutesLateUndertime,
        conversion: cscConversion(totalMinutesLateUndertime).toFixed(3),
        numberOfTimesHalfDay: halfDayDates.length,
        daysHalfDay: halfDayDates.join(', '),
        noAttendance: na?.noAttendance ?? '',
        numberOfNoAttendance: Number(na?.noAttendanceCount ?? 0),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Employee Tardiness: every late record in the range. Params: [dateFrom, dateTo, companyIds]. */
export function tardinessSql() {
  return `
  SELECT d.company_id_fk companyId, DATE_FORMAT(d.dtr_date, '%Y-%m-%d') dtrDate,
         TIME_FORMAT(s.time_in, '%H:%i') scheduleTimeIn, TIME_FORMAT(s.lunch_in, '%H:%i') scheduleLunchIn,
         TIME_FORMAT(d.time_in, '%H:%i') timeIn, TIME_FORMAT(d.lunch_out, '%H:%i') lunchOut,
         TIME_FORMAT(d.lunch_in, '%H:%i') lunchIn, TIME_FORMAT(d.time_out, '%H:%i') timeOut,
         l.debit_value credits
    FROM leave_card_ledger_debit l
    INNER JOIN daily_time_record d ON d.daily_time_record_id = l.daily_time_record_id_fk
    LEFT JOIN schedule s ON s.schedule_id = d.schedule_id_fk
   WHERE l.deleted_at IS NULL AND l.dtr_deduction_type = 'Tardiness'
     AND d.dtr_date >= ? AND d.dtr_date <= ? AND d.company_id_fk IN (?)
   ORDER BY d.dtr_date;`;
}

export type TardinessRow = {
  companyId: string;
  dtrDate: string;
  scheduleTimeIn: string | null;
  scheduleLunchIn: string | null;
  timeIn: string | null;
  lunchOut: string | null;
  lunchIn: string | null;
  timeOut: string | null;
  credits: number | string;
};

export type TardinessReportItem = TardinessRow & {
  employeeId: string;
  name: string;
  minutesLate: number;
  conversion: string;
};

export function buildTardinessReport(
  employees: { employeeId: string; companyId: string; name: string }[],
  rows: TardinessRow[]
): TardinessReportItem[] {
  const byCompany = new Map(employees.map((e) => [e.companyId, e]));
  return rows
    .filter((r) => byCompany.has(r.companyId))
    .map((r) => {
      const e = byCompany.get(r.companyId);
      const credits = Number(r.credits);
      return { ...r, employeeId: e.employeeId, name: e.name, minutesLate: Math.round(credits * 480), conversion: credits.toFixed(3) };
    })
    .sort((a, b) => a.name.localeCompare(b.name) || a.dtrDate.localeCompare(b.dtrDate));
}
