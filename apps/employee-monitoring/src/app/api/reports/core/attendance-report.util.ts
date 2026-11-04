import dayjs = require('dayjs');

/**
 * Report on Attendance, computed from the leave ledger so the report and the ledger always agree:
 *  - lates, undertimes and half days are the DTR deductions posted to the leave ledger (Tardiness / Undertime /
 *    Half Day), plus the Half Day / Undertime pass slip deductions
 *  - minutes late/undertime = the posted credits x 480 (credits are minutes / 480 rounded up to 3 decimals)
 *  - conversion = the credits actually deducted
 *  - no attendance = scheduled working days (not a rest day, holiday, whole-day work suspension, approved leave,
 *    travel order, HR remark on the DTR, or after separation) without any time log
 * Everything is computed in three set-based queries for all employees at once.
 */

export type AttendanceDeductionRow = {
  companyId: string;
  kind: 'Tardiness' | 'Undertime' | 'Half Day';
  times: number | string;
  dates: string | null;
  credits: number | string | null;
};

export type NoAttendanceRow = { companyId: string; noAttendance: string | null; noAttendanceCount: number | string };

export type AttendanceReportItem = {
  employeeId: string;
  companyId: string;
  name: string;
  numberOfTimesLate: number;
  datesLate: string;
  numberOfTimesUndertime: number;
  datesUndertime: string;
  totalMinutesLateUndertime: number;
  conversion: string;
  numberOfTimesHalfDay: number;
  daysHalfDay: string;
  noAttendance: string;
  numberOfNoAttendance: number;
};

const ymd = (d: Date | string) => dayjs(d).format('YYYY-MM-DD');

/** Ledger deductions per employee and kind. Params: [dateFrom, dateTo, companyIds, dateFrom, dateTo, companyIds]. */
export function attendanceDeductionsSql(hrms = process.env.HRMS_DB_NAME ?? '') {
  return `
  SELECT companyId, kind, COUNT(DISTINCT dtrDate) times,
         GROUP_CONCAT(DISTINCT DATE_FORMAT(dtrDate, '%Y-%m-%d') ORDER BY dtrDate SEPARATOR ', ') dates,
         SUM(credits) credits
    FROM (
      SELECT d.company_id_fk companyId, l.dtr_deduction_type kind, d.dtr_date dtrDate, l.debit_value credits
        FROM leave_card_ledger_debit l
        INNER JOIN daily_time_record d ON d.daily_time_record_id = l.daily_time_record_id_fk
       WHERE l.deleted_at IS NULL AND l.dtr_deduction_type IN ('Tardiness', 'Undertime', 'Half Day')
         AND d.dtr_date >= ? AND d.dtr_date <= ? AND d.company_id_fk IN (?)
      UNION ALL
      SELECT e.company_id companyId, ps.nature_of_business kind, DATE(ps.date_of_application) dtrDate, l.debit_value credits
        FROM leave_card_ledger_debit l
        INNER JOIN pass_slip ps ON ps.pass_slip_id = l.pass_slip_id_fk
        INNER JOIN ${hrms}employees e ON e._id = ps.employee_id_fk
       WHERE l.deleted_at IS NULL AND ps.nature_of_business IN ('Undertime', 'Half Day')
         AND ps.date_of_application >= ? AND ps.date_of_application < DATE_ADD(?, INTERVAL 1 DAY) AND e.company_id IN (?)
    ) deductions
   GROUP BY companyId, kind;`;
}

export function attendanceDeductionsParams(dateFrom: Date | string, dateTo: Date | string, companyIds: string[]) {
  return [ymd(dateFrom), ymd(dateTo), companyIds, ymd(dateFrom), ymd(dateTo), companyIds];
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
  deductions: AttendanceDeductionRow[],
  noAttendance: NoAttendanceRow[]
): AttendanceReportItem[] {
  const byCompany = new Map<string, Partial<Record<AttendanceDeductionRow['kind'], AttendanceDeductionRow>>>();
  for (const row of deductions) {
    const item = byCompany.get(row.companyId) ?? {};
    const prev = item[row.kind];
    // DTR and pass slip undertime / half day on different days: merge
    item[row.kind] = prev
      ? {
          ...prev,
          times: Number(prev.times) + Number(row.times),
          dates: [prev.dates, row.dates].filter(Boolean).join(', '),
          credits: Number(prev.credits ?? 0) + Number(row.credits ?? 0),
        }
      : row;
    byCompany.set(row.companyId, item);
  }
  const absent = new Map(noAttendance.map((r) => [r.companyId, r]));
  const sortDates = (dates: string | null | undefined) => [...new Set((dates ?? '').split(', ').filter(Boolean))].sort().join(', ');

  return employees
    .map(({ employeeId, companyId, name }) => {
      const k = byCompany.get(companyId) ?? {};
      const late = k['Tardiness'];
      const under = k['Undertime'];
      const half = k['Half Day'];
      const credits = Number(late?.credits ?? 0) + Number(under?.credits ?? 0);
      const na = absent.get(companyId);
      return {
        employeeId,
        companyId,
        name,
        numberOfTimesLate: Number(late?.times ?? 0),
        datesLate: sortDates(late?.dates),
        numberOfTimesUndertime: Number(under?.times ?? 0),
        datesUndertime: sortDates(under?.dates),
        totalMinutesLateUndertime: Math.round(credits * 480),
        conversion: credits.toFixed(3),
        numberOfTimesHalfDay: Number(half?.times ?? 0),
        daysHalfDay: sortDates(half?.dates),
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
