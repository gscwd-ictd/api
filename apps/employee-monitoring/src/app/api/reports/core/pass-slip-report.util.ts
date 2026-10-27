import { NatureOfBusiness } from '@gscwd-api/utils';
import dayjs = require('dayjs');
import {
  computeUsedMinutes,
  minutesToCredits,
  quarterStart,
  toMinutes,
  WELLNESS_ALLOWANCE_MINUTES,
} from '../../pass-slip/core/pass-slip-deduction.util';

/**
 * Pass slip reports use the same rules as the leave ledger (pass-slip-deduction.util):
 *  - all approved statuses (approved, approved with/without medical certificate)
 *  - lunch break excluded; no pass slip IN -> schedule time out
 *  - Half Day / Undertime: pass slip OUT -> schedule time out
 *  - credits per pass slip = the ledger debit when one was posted, else minutes / 480 rounded up to 3 decimals
 *  - the whole last day of the range is included (date_of_application has a time part)
 */
export const REPORT_APPROVED_STATUSES = ['approved', 'approved with medical certificate', 'approved without medical certificate'];

export const PERSONAL_REPORT_NATURES = [NatureOfBusiness.PERSONAL, NatureOfBusiness.HALF_DAY, NatureOfBusiness.UNDERTIME];

export type PassSlipReportRow = {
  id: string;
  employeeId: string;
  psDate: string; // YYYY-MM-DD
  createdAt?: Date | string;
  natureOfBusiness: NatureOfBusiness;
  timeOut: string | null;
  timeIn: string | null;
  reason: string | null;
  scheduleTimeIn: string | null;
  scheduleTimeOut: string | null;
  lunchOut: string | null;
  lunchIn: string | null;
  ledgerDebit: string | number | null;
};

/**
 * Params: [natures..., statuses..., dateFrom, dateTo]. Build with passSlipReportSql(natureCount).
 * Schedule: the DTR schedule of the day, else the employee schedule in effect (same as the ledger).
 */
export function passSlipReportSql(natureCount: number, hrmsDb = process.env.HRMS_DB_NAME ?? '') {
  const natures = new Array(natureCount).fill('?').join(',');
  const statuses = REPORT_APPROVED_STATUSES.map(() => '?').join(',');
  return `
  SELECT x.*, s.time_in scheduleTimeIn, s.time_out scheduleTimeOut, s.lunch_out lunchOut, s.lunch_in lunchIn
    FROM (
      SELECT ps.pass_slip_id id, ps.employee_id_fk employeeId, DATE_FORMAT(ps.date_of_application,'%Y-%m-%d') psDate,
             ps.created_at createdAt, ps.nature_of_business natureOfBusiness,
             COALESCE(ps.time_out, ps.encoded_time_out) timeOut, COALESCE(ps.time_in, ps.encoded_time_in) timeIn,
             ps.purpose_destination reason,
             (SELECT l.debit_value FROM leave_card_ledger_debit l WHERE l.pass_slip_id_fk = ps.pass_slip_id AND l.deleted_at IS NULL LIMIT 1) ledgerDebit,
             COALESCE(
               (SELECT dtr.schedule_id_fk FROM daily_time_record dtr
                 INNER JOIN ${hrmsDb}employees e ON e.company_id = dtr.company_id_fk
                 WHERE e._id = ps.employee_id_fk AND dtr.dtr_date = DATE(ps.date_of_application) LIMIT 1),
               (SELECT es.schedule_id_fk FROM employee_schedule es
                 WHERE es.employee_id_fk = ps.employee_id_fk AND es.deleted_at IS NULL
                   AND es.date_from <= DATE(ps.date_of_application)
                   AND (es.date_to IS NULL OR es.date_to >= DATE(ps.date_of_application))
                 ORDER BY es.date_from DESC, es.created_at DESC LIMIT 1)
             ) scheduleId
        FROM pass_slip ps
       INNER JOIN pass_slip_approval psa ON psa.pass_slip_id_fk = ps.pass_slip_id
       WHERE ps.deleted_at IS NULL
         AND ps.nature_of_business IN (${natures})
         AND psa.status IN (${statuses})
         AND COALESCE(ps.time_out, ps.encoded_time_out) IS NOT NULL
         AND ps.date_of_application >= ? AND ps.date_of_application < DATE_ADD(?, INTERVAL 1 DAY)
    ) x
    LEFT JOIN schedule s ON s.schedule_id = x.scheduleId
   ORDER BY x.psDate ASC, x.createdAt ASC;`;
}

export function passSlipReportParams(natures: NatureOfBusiness[], dateFrom: Date | string, dateTo: Date | string) {
  return [...natures, ...REPORT_APPROVED_STATUSES, dayjs(dateFrom).format('YYYY-MM-DD'), dayjs(dateTo).format('YYYY-MM-DD')];
}

/** Minutes used by one pass slip, lunch excluded (same as the ledger). */
export function reportMinutes(row: PassSlipReportRow): number {
  if (!row.scheduleTimeIn || !row.scheduleTimeOut) {
    // no schedule found: plain OUT -> IN
    const out = toMinutes(row.timeOut);
    const back = toMinutes(row.timeIn);
    return out !== null && back !== null && back > out ? back - out : 0;
  }
  const natureOfBusiness =
    row.natureOfBusiness === NatureOfBusiness.OFFICIAL_BUSINESS ? NatureOfBusiness.PERSONAL : (row.natureOfBusiness as NatureOfBusiness);
  return computeUsedMinutes({
    natureOfBusiness,
    timeOut: row.timeOut,
    timeIn: row.timeIn,
    schedule: { timeIn: row.scheduleTimeIn, timeOut: row.scheduleTimeOut, lunchOut: row.lunchOut, lunchIn: row.lunchIn },
  });
}

function to12h(time: string | null): string {
  if (!time) return '';
  return dayjs(`2000-01-01 ${time}`).format('hh:mm A');
}

/** 'hh:mm AM - hh:mm PM'; Half Day / Undertime / no IN end at the schedule time out. */
export function reportTimeOutIn(row: PassSlipReportRow): string {
  const endsAtScheduleOut = row.natureOfBusiness === NatureOfBusiness.HALF_DAY || row.natureOfBusiness === NatureOfBusiness.UNDERTIME || !row.timeIn;
  const back = endsAtScheduleOut ? row.scheduleTimeOut ?? row.timeIn : row.timeIn;
  return `${to12h(row.timeOut)} - ${to12h(back)}`;
}

const credits3 = (n: number) => n.toFixed(3);

/** Leave credits of one slip: the ledger debit when posted (what was actually charged), else computed from the minutes. */
export function reportCredits(row: PassSlipReportRow, minutes: number): number {
  if (row.ledgerDebit !== null && row.ledgerDebit !== undefined) return Number(row.ledgerDebit);
  return minutesToCredits(minutes);
}

export type DetailedPassSlipReportItem = {
  employeeId: string;
  name: string;
  psDate: string;
  natureOfBusiness: string;
  noOfMinConsumed: number;
  conversion: string;
  timeInTimeOut: string;
  reason: string | null;
  ledgerDebit: string | null;
};

export function buildDetailedReport(rows: PassSlipReportRow[], names: Map<string, string>): DetailedPassSlipReportItem[] {
  return rows
    .filter((row) => names.has(row.employeeId))
    .map((row) => {
      const minutes = reportMinutes(row);
      return {
        employeeId: row.employeeId,
        name: names.get(row.employeeId),
        psDate: row.psDate,
        natureOfBusiness: row.natureOfBusiness,
        noOfMinConsumed: minutes,
        conversion: credits3(reportCredits(row, minutes)),
        timeInTimeOut: reportTimeOutIn(row),
        reason: row.reason,
        ledgerDebit: row.ledgerDebit === null || row.ledgerDebit === undefined ? null : Number(row.ledgerDebit).toFixed(3),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name) || a.psDate.localeCompare(b.psDate));
}

export type PassSlipSummaryItem = {
  employeeId: string;
  name: string;
  noOfTimes: string;
  dates: string;
  totalMinutes: string;
  conversion: string;
};

export function buildSummaryReport(rows: PassSlipReportRow[], names: Map<string, string>): PassSlipSummaryItem[] {
  const byEmployee = new Map<string, { dates: string[]; minutes: number; credits: number }>();
  for (const row of rows) {
    if (!names.has(row.employeeId)) continue;
    const minutes = reportMinutes(row);
    const item = byEmployee.get(row.employeeId) ?? { dates: [], minutes: 0, credits: 0 };
    item.dates.push(row.psDate);
    item.minutes += minutes;
    item.credits += reportCredits(row, minutes);
    byEmployee.set(row.employeeId, item);
  }
  return [...byEmployee.entries()]
    .map(([employeeId, item]) => ({
      employeeId,
      name: names.get(employeeId),
      noOfTimes: String(item.dates.length),
      dates: item.dates.join(', '),
      totalMinutes: item.minutes.toFixed(2),
      conversion: credits3(item.credits),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export type WellnessPassReportItem = {
  employeeId: string;
  name: string;
  noOfTimes: number;
  /** each Wellness Pass: date and hours used */
  wellnessDates: { date: string; timeOutIn: string; minutes: number; hours: string }[];
  dates: string;
  totalMinutes: number;
  accumulatedHours: string;
  /** minutes beyond the 4-hour allowance of each quarter */
  excessMinutes: number;
  chargedToLeave: string;
};

/** Per employee: Wellness Pass dates and accumulated hours. Excess is counted per quarter (240 free minutes). */
export function buildWellnessReport(rows: PassSlipReportRow[], names: Map<string, string>): WellnessPassReportItem[] {
  const byEmployee = new Map<string, WellnessPassReportItem & { usedByQuarter: Map<string, number>; charged: number }>();
  for (const row of rows) {
    if (row.natureOfBusiness !== NatureOfBusiness.WELLNESS_PASS) continue;
    const name = names.get(row.employeeId);
    if (name === undefined) continue;
    const minutes = reportMinutes(row);
    const item =
      byEmployee.get(row.employeeId) ??
      ({
        employeeId: row.employeeId,
        name,
        noOfTimes: 0,
        wellnessDates: [],
        dates: '',
        totalMinutes: 0,
        accumulatedHours: '0.00',
        excessMinutes: 0,
        chargedToLeave: '0.000',
        usedByQuarter: new Map<string, number>(),
        charged: 0,
      } as WellnessPassReportItem & { usedByQuarter: Map<string, number>; charged: number });
    const quarter = quarterStart(row.psDate);
    const usedBefore = item.usedByQuarter.get(quarter) ?? 0;
    item.excessMinutes += Math.max(0, minutes - Math.max(0, WELLNESS_ALLOWANCE_MINUTES - usedBefore));
    item.usedByQuarter.set(quarter, usedBefore + minutes);
    item.noOfTimes += 1;
    item.totalMinutes += minutes;
    item.charged += Number(row.ledgerDebit ?? 0);
    item.wellnessDates.push({ date: row.psDate, timeOutIn: reportTimeOutIn(row), minutes, hours: (minutes / 60).toFixed(2) });
    byEmployee.set(row.employeeId, item);
  }
  return [...byEmployee.values()]
    .map(({ usedByQuarter, charged, ...item }) => ({
      ...item,
      dates: item.wellnessDates.map((d) => `${d.date} (${d.hours} hrs)`).join(', '),
      accumulatedHours: (item.totalMinutes / 60).toFixed(2),
      chargedToLeave: charged.toFixed(3),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
