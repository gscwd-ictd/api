/**
 * Overtime time logs (encoded time in / out) must belong to the overtime's planned date (HR 2026-11-05):
 *  - OT start: on the planned date (the portal fixes the start date to the planned date; only the time
 *    is encoded).
 *  - OT end: on or after the planned date, after the start, and at most 24 hours after it (overnight OT
 *    ends the next day).
 *
 * Catches logs typed on the wrong date (e.g. 2026-10-29 10:00 for an OT planned 2026-10-28, or a wrong
 * month / year), which otherwise silently move the hours out of the planned date (work suspension OT
 * counted as regular OT, or a month of hours).
 */
import dayjs = require('dayjs');

export const OT_MAX_HOURS = 24;

export function validateOvertimeLogWindow(
  plannedDate: string | Date,
  encodedTimeIn: string | Date | null | undefined,
  encodedTimeOut: string | Date | null | undefined
): string | null {
  const day = dayjs(plannedDate).format('YYYY-MM-DD');
  const fmt = (d: dayjs.Dayjs) => d.format('MMM D, YYYY h:mm A');
  const plannedLabel = dayjs(day).format('MMM D, YYYY');

  const start = encodedTimeIn ? dayjs(encodedTimeIn) : null;
  const end = encodedTimeOut ? dayjs(encodedTimeOut) : null;

  if (start && start.isValid() && start.format('YYYY-MM-DD') !== day)
    return `Overtime start (${fmt(start)}) must be on the planned date ${plannedLabel}.`;
  if (end && end.isValid() && end.format('YYYY-MM-DD') < day) return `Overtime end (${fmt(end)}) must be on or after the planned date ${plannedLabel}.`;
  if (start && end && start.isValid() && end.isValid()) {
    if (!end.isAfter(start)) return `Overtime end (${fmt(end)}) must be after the overtime start (${fmt(start)}).`;
    if (end.diff(start, 'minute') > OT_MAX_HOURS * 60)
      return `Overtime end (${fmt(end)}) is more than ${OT_MAX_HOURS} hours after the start. Please check the date of the overtime end.`;
  }
  return null;
}
