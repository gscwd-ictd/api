/**
 * Overtime split for work suspension dates (HRMS work suspension rework spec, rule 3).
 *
 * Only the OT minutes that overlap the suspension window (suspension start -> 12:00 midnight of
 * the suspension date) earn the suspension multiplier (1.5x); the rest stay regular (1.25x).
 *
 * The rendered hours (already computed by the OT rules, e.g. the > 4 hours deduction) are split
 * by the share of the OT log interval that falls inside the window, so the total never changes.
 */
import dayjs = require('dayjs');
import { MINUTES_PER_DAY } from '../../work-suspension/core/work-suspension-window.util';

export const REGULAR_OT_MULTIPLIER = 1.25;
export const SUSPENSION_OT_MULTIPLIER = 1.5;

export type OvertimeSuspensionSplit = { regularHrs: number; suspensionHrs: number };

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

/**
 * @param hoursRendered  hours credited for the OT (null/0 -> nothing to split)
 * @param otStart        OT time in (encoded/actual), full date-time
 * @param otEnd          OT time out, full date-time
 * @param suspensionDate the suspension date (YYYY-MM-DD or Date)
 * @param windowStart    suspension start in minutes from 00:00 of the suspension date
 *                       (SuspensionWindow.start), or null when the date is not suspended
 */
export function splitOvertimeBySuspension(
  hoursRendered: number | null,
  otStart: Date | string | null,
  otEnd: Date | string | null,
  suspensionDate: Date | string,
  windowStart: number | null
): OvertimeSuspensionSplit {
  const hours = hoursRendered && hoursRendered > 0 ? hoursRendered : 0;
  if (hours === 0 || windowStart === null) return { regularHrs: hours, suspensionHrs: 0 };

  // without OT logs the overlap is unknown; keep everything regular
  if (!otStart || !otEnd) return { regularHrs: hours, suspensionHrs: 0 };

  const start = dayjs(otStart);
  const end = dayjs(otEnd);
  const total = end.diff(start, 'minute');
  if (!start.isValid() || !end.isValid() || total <= 0) return { regularHrs: hours, suspensionHrs: 0 };

  const day = dayjs(dayjs(suspensionDate).format('YYYY-MM-DD'));
  const windowFrom = day.add(windowStart, 'minute');
  const windowTo = day.add(MINUTES_PER_DAY, 'minute');

  const overlapFrom = start.isAfter(windowFrom) ? start : windowFrom;
  const overlapTo = end.isBefore(windowTo) ? end : windowTo;
  const overlap = Math.max(0, overlapTo.diff(overlapFrom, 'minute'));

  const suspensionHrs = Math.min(hours, round2((hours * overlap) / total));
  return { regularHrs: round2(hours - suspensionHrs), suspensionHrs };
}

/**
 * TIME_OF_DAY suspension: OT logs that start before the suspension start and end after it begin at the
 * suspension start; the hours before it are the employee's regular duty, not overtime (HR 2026-11-05,
 * e.g. Servano 2026-10-28 logged 07:54-17:00 with the suspension from 10:00 -> 10:00-17:00).
 * Logs fully before or fully after the suspension start are unchanged.
 *
 * @param windowStart suspension start in minutes from 00:00 of the date, or null when not suspended
 */
export function clipOvertimeStartToSuspension(
  otStart: Date | string | null,
  otEnd: Date | string | null,
  suspensionDate: Date | string,
  windowStart: number | null
): Date | null {
  if (!otStart) return null;
  const start = dayjs(otStart);
  if (windowStart === null || !otEnd || !start.isValid()) return start.toDate();
  const end = dayjs(otEnd);
  const suspensionStart = dayjs(dayjs(suspensionDate).format('YYYY-MM-DD')).add(windowStart, 'minute');
  return start.isBefore(suspensionStart) && end.isAfter(suspensionStart) ? suspensionStart.toDate() : start.toDate();
}
