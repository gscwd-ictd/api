/**
 * Late / undertime / half day / absence on a WHOLE_DAY or TIME_OF_DAY work suspension date.
 *
 * Replaces the normal DTR result for that day (LEGACY suspensions keep the old code path).
 * Everything is in minutes on the schedule timeline (see work-suspension-window.util):
 *   required time = duty − suspended interval − lunch
 *   late          = required minutes between duty start and time in
 *                   (+ required minutes after lunch end + 29 min grace until the lunch-in log)
 *   undertime     = required minutes between time out and duty end
 *   half day      = came in after lunch start while the morning was required, or
 *                   left before lunch end while the afternoon was required
 *   whole duty suspended (e.g. WHOLE_DAY day shift) → nothing is counted, not even absence.
 */
import { WorkSuspensionType } from '@gscwd-api/models';
import {
  Interval,
  MINUTES_PER_DAY,
  overlapMinutes,
  resolveDutyWindow,
  resolveLunchWindow,
  SuspensionSchedule,
  SuspensionWindow,
  toMinutes,
} from './work-suspension-window.util';

export const LUNCH_IN_GRACE_MINUTES = 29;

export type DtrLogs = {
  timeIn: string | null;
  lunchOut: string | null;
  lunchIn: string | null;
  timeOut: string | null;
};

export type DtrDayResult = {
  minutesLate: number;
  noOfLates: number;
  noOfUndertimes: number;
  minutesUndertime: number;
  noAttendance: number;
  isHalfDay: boolean;
};

export type SuspensionDtrSchedule = SuspensionSchedule & { lunchOut?: string | null; lunchIn?: string | null };

/** Suspended part of the duty: [max(start, duty start), min(duty end, midnight)]. Null when nothing is suspended. */
export function getSuspendedInterval(window: SuspensionWindow, schedule: SuspensionSchedule): Interval | null {
  if (!window.isSuspended || window.start === null || window.end === null) return null;
  const duty = resolveDutyWindow(schedule);
  const interval = { start: Math.max(window.start, duty.start), end: Math.min(window.end, duty.end) };
  return interval.end > interval.start ? interval : null;
}

/** Required (not suspended, not lunch) minutes of the duty that fall inside `range`. */
export function requiredMinutesWithin(range: Interval, duty: Interval, lunch: Interval, suspended: Interval | null): number {
  if (range.end <= range.start) return 0;
  const inDuty: Interval = { start: Math.max(range.start, duty.start), end: Math.min(range.end, duty.end) };
  if (inDuty.end <= inDuty.start) return 0;
  const total = inDuty.end - inDuty.start;
  const lunchPart = overlapMinutes(inDuty, lunch);
  const suspendedPart = suspended ? overlapMinutes(inDuty, suspended) : 0;
  const lunchAndSuspended = suspended ? overlapMinutes(inDuty, { start: Math.max(lunch.start, suspended.start), end: Math.min(lunch.end, suspended.end) }) : 0;
  return Math.max(0, total - lunchPart - suspendedPart + lunchAndSuspended);
}

/** Put a log on the schedule timeline (after-midnight logs of a night shift become > 1440). */
export function logToTimeline(time: string | null, duty: Interval): number | null {
  const minutes = toMinutes(time);
  if (minutes === null) return null;
  const overnight = duty.end > MINUTES_PER_DAY;
  // a log more than 4 hours before duty start on an overnight schedule belongs to the next day
  if (overnight && minutes < duty.start - 240) return minutes + MINUTES_PER_DAY;
  return minutes;
}

const ZERO: DtrDayResult = { minutesLate: 0, noOfLates: 0, noOfUndertimes: 0, minutesUndertime: 0, noAttendance: 0, isHalfDay: false };

export function applyWorkSuspensionToDtr(
  window: SuspensionWindow,
  schedule: SuspensionDtrSchedule,
  logs: DtrLogs,
  base: DtrDayResult
): DtrDayResult {
  if (!window.isSuspended || window.type === WorkSuspensionType.LEGACY) return base;

  const duty = resolveDutyWindow(schedule);
  const lunch = resolveLunchWindow(schedule);
  const suspended = getSuspendedInterval(window, schedule);
  if (!suspended) return base; // suspension starts after this schedule's time out

  const requiredTotal = requiredMinutesWithin(duty, duty, lunch, suspended);
  if (requiredTotal === 0) return { ...ZERO }; // whole duty suspended

  const timeIn = logToTimeline(logs.timeIn, duty);
  const timeOut = logToTimeline(logs.timeOut, duty);
  const lunchInLog = logToTimeline(logs.lunchIn, duty);

  // no logs at all: absent only for the required part (keep the normal absence flag)
  if (timeIn === null && timeOut === null && logs.lunchOut === null && logs.lunchIn === null) {
    return { ...ZERO, noAttendance: base.noAttendance };
  }

  // incomplete logs: keep the normal result, but nothing can be late/undertime inside the suspension
  if (timeIn === null || timeOut === null) {
    return base;
  }

  const lastRequiredEnd = suspended.end >= duty.end ? suspended.start : duty.end;
  const firstRequiredStart = suspended.start <= duty.start ? suspended.end : duty.start;

  // arrived when nothing was required anymore → not late, not absent
  if (timeIn >= lastRequiredEnd) return { ...ZERO };

  const morningRequired = requiredMinutesWithin({ start: duty.start, end: lunch.start }, duty, lunch, suspended);
  const afternoonRequired = requiredMinutesWithin({ start: lunch.end, end: duty.end }, duty, lunch, suspended);

  const cameInAfternoon = timeIn >= lunch.start && morningRequired > 0;
  const leftInMorning = timeOut <= lunch.end && afternoonRequired > 0;
  const isHalfDay = cameInAfternoon || leftInMorning;

  // late: morning part is not counted as late minutes when it is already a half day
  const lateFrom = cameInAfternoon ? lunch.end : firstRequiredStart;
  const lateMorning = timeIn > lateFrom ? requiredMinutesWithin({ start: lateFrom, end: timeIn }, duty, lunch, suspended) : 0;

  let lateAfternoon = 0;
  const hasScheduleLunch = !!schedule.lunchOut && !!schedule.lunchIn;
  if (hasScheduleLunch && !cameInAfternoon && lunchInLog !== null) {
    const graceEnd = lunch.end + LUNCH_IN_GRACE_MINUTES;
    lateAfternoon = lunchInLog > graceEnd ? requiredMinutesWithin({ start: graceEnd, end: lunchInLog }, duty, lunch, suspended) : 0;
  }

  // undertime: afternoon part is not counted as undertime minutes when it is already a half day
  const undertimeTo = leftInMorning ? lunch.start : lastRequiredEnd;
  const minutesUndertime = timeOut < undertimeTo ? requiredMinutesWithin({ start: timeOut, end: undertimeTo }, duty, lunch, suspended) : 0;

  return {
    minutesLate: lateMorning + lateAfternoon,
    noOfLates: (lateMorning > 0 ? 1 : 0) + (lateAfternoon > 0 ? 1 : 0) + (cameInAfternoon && lateMorning === 0 ? 1 : 0),
    noOfUndertimes: minutesUndertime > 0 || leftInMorning ? 1 : 0,
    minutesUndertime,
    noAttendance: 0,
    isHalfDay,
  };
}

/**
 * Hours / start that the existing punch-sorting code expects (legacy semantics: scans after
 * "time out − suspensionHours" are treated as time out). Only a suspension that runs to the end of
 * duty (day shifts) moves the time-out slot; for night shifts the suspension is at the start of duty,
 * so time out stays at the scheduled time out.
 */
export function toSortingSuspension(window: SuspensionWindow, schedule: SuspensionSchedule): { suspensionHours: number; startMinutes: number | null } {
  const suspended = getSuspendedInterval(window, schedule);
  if (!suspended) return { suspensionHours: 0, startMinutes: null };
  const duty = resolveDutyWindow(schedule);
  if (suspended.end < duty.end) return { suspensionHours: 0, startMinutes: null };
  return { suspensionHours: (duty.end - suspended.start) / 60, startMinutes: suspended.start };
}
