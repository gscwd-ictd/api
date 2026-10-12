/**
 * Pure work suspension window logic (no DB access).
 *
 * All times are minutes from 00:00 of the DTR / suspension date. Times on the next
 * day (night shift) are expressed as > 1440, e.g. 06:00 next day = 1800.
 *
 * Rules (HRMS work suspension rework spec):
 *  - Suspension is WHOLE_DAY or TIME_OF_DAY (start time). Cut-off is always 12:00 midnight
 *    of the suspension date, so for a night shift only the part before midnight is suspended.
 *  - Suspended time runs from the suspension start (schedule time in for WHOLE_DAY) to the
 *    scheduled time out, capped at midnight, excluding lunch.
 *  - Lunch: the schedule's lunch; if none (or bad data), the 5th hour of duty (time in + 4h -> + 5h).
 *  - f = suspendedMinutes / 480, max 1.
 *  - Night differential window is 18:00 - 06:00.
 */
import { WorkSuspensionType } from '@gscwd-api/models';

export const MINUTES_PER_DAY = 1440;
export const WORK_DAY_MINUTES = 480;
export const ND_START = 18 * 60; // 18:00
export const ND_END = 24 * 60 + 6 * 60; // 06:00 next day

export type SuspensionSchedule = {
  timeIn: string;
  timeOut: string;
  lunchOut?: string | null;
  lunchIn?: string | null;
};

export type SuspensionInput = {
  suspensionType: WorkSuspensionType;
  suspensionStartTime?: string | null;
};

export type Interval = { start: number; end: number };

export type SuspensionWindow = {
  isSuspended: boolean;
  type: WorkSuspensionType | null;
  /** suspension start used for the computation (minutes) */
  start: number | null;
  /** always midnight (1440) when suspended */
  end: number | null;
  /** suspended duty minutes, lunch excluded */
  suspendedMinutes: number;
  /** suspendedMinutes / 480, max 1 */
  fraction: number;
  /** suspended duty minutes inside the 18:00 - 06:00 night differential window, lunch excluded */
  ndSuspendedMinutes: number;
};

const NOT_SUSPENDED: SuspensionWindow = {
  isSuspended: false,
  type: null,
  start: null,
  end: null,
  suspendedMinutes: 0,
  fraction: 0,
  ndSuspendedMinutes: 0,
};

/** 'HH:mm' or 'HH:mm:ss' -> minutes. Seconds are dropped. */
export function toMinutes(time: string | null | undefined): number | null {
  if (time === null || time === undefined || time === '') return null;
  const [h, m] = time.split(':').map((v) => parseInt(v, 10));
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
}

export function overlapMinutes(a: Interval, b: Interval): number {
  return Math.max(0, Math.min(a.end, b.end) - Math.max(a.start, b.start));
}

/** Duty interval of the schedule on the DTR date; time out <= time in means it ends the next day. */
export function resolveDutyWindow(schedule: SuspensionSchedule): Interval {
  const start = toMinutes(schedule.timeIn);
  let end = toMinutes(schedule.timeOut);
  if (start === null || end === null) throw new Error('Schedule time in / time out is required');
  if (end <= start) end += MINUTES_PER_DAY;
  return { start, end };
}

/**
 * Lunch interval on the same timeline as resolveDutyWindow.
 * Uses the schedule lunch when it is set, lies inside duty and is at most 3 hours
 * (longer is treated as bad data, e.g. lunch_in 23:31); otherwise time in + 4h -> + 5h.
 */
export function resolveLunchWindow(schedule: SuspensionSchedule): Interval {
  const duty = resolveDutyWindow(schedule);
  let lunchStart = toMinutes(schedule.lunchOut);
  let lunchEnd = toMinutes(schedule.lunchIn);

  if (lunchStart !== null && lunchEnd !== null) {
    // move lunch onto the night-shift timeline when it falls after midnight
    if (lunchStart < duty.start) lunchStart += MINUTES_PER_DAY;
    if (lunchEnd < lunchStart) lunchEnd += MINUTES_PER_DAY;
    const length = lunchEnd - lunchStart;
    if (length > 0 && length <= 180 && lunchStart >= duty.start && lunchEnd <= duty.end) {
      return { start: lunchStart, end: lunchEnd };
    }
  }

  const start = duty.start + 240;
  return { start, end: start + 60 };
}

/** Minutes of `interval` that are duty time (lunch excluded). */
function dutyMinutesWithin(interval: Interval, lunch: Interval): number {
  if (interval.end <= interval.start) return 0;
  return interval.end - interval.start - overlapMinutes(interval, lunch);
}

/**
 * Suspension window for one employee schedule on the suspension date.
 * LEGACY suspensions are not handled here (they keep using the existing DB functions),
 * so they return isSuspended = false.
 */
export function getSuspensionWindow(suspension: SuspensionInput | null | undefined, schedule: SuspensionSchedule): SuspensionWindow {
  if (!suspension || suspension.suspensionType === WorkSuspensionType.LEGACY) return { ...NOT_SUSPENDED };

  const duty = resolveDutyWindow(schedule);
  const lunch = resolveLunchWindow(schedule);

  let start: number;
  if (suspension.suspensionType === WorkSuspensionType.WHOLE_DAY) {
    start = duty.start;
  } else {
    const s = toMinutes(suspension.suspensionStartTime);
    if (s === null) throw new Error('suspensionStartTime is required for TIME_OF_DAY suspensions');
    start = s;
  }
  const end = MINUTES_PER_DAY;

  const suspendedInterval: Interval = { start: Math.max(start, duty.start), end: Math.min(duty.end, end) };
  const suspendedMinutes = dutyMinutesWithin(suspendedInterval, lunch);

  const ndInterval: Interval = {
    start: Math.max(suspendedInterval.start, ND_START),
    end: Math.min(suspendedInterval.end, ND_END),
  };
  // the early-morning part of the ND window (00:00 - 06:00 of the same date) can also overlap a
  // schedule starting after midnight; suspension ends at midnight, so only 18:00 - 24:00 matters.
  const ndSuspendedMinutes = dutyMinutesWithin(ndInterval, lunch);

  return {
    isSuspended: true,
    type: suspension.suspensionType,
    start,
    end,
    suspendedMinutes,
    fraction: Math.min(1, suspendedMinutes / WORK_DAY_MINUTES),
    ndSuspendedMinutes,
  };
}
