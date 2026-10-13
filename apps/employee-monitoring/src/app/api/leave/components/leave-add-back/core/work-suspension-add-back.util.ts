/**
 * Leave credits to add back (or deduct) for a leave day that falls on a WHOLE_DAY / TIME_OF_DAY
 * work suspension (HRMS work suspension rework spec, section 3). LEGACY suspensions keep the old code.
 *
 * | Leave                          | Whole day        | Time of day              |
 * |--------------------------------|------------------|--------------------------|
 * | VL / SL (and other leave types)| +1 same type     | +f same type             |
 * | Forced Leave                   | +1 FL, +1 VL     | +1 FL, +f VL             |
 * | Special Privilege Leave        | +1 SPL           | +1 SPL, −(1−f) VL        |
 * | Wellness Leave                 | +1 Wellness      | +1 Wellness, −(1−f) VL   |
 * | Special Leave Benefits, LWOP   | none             | none                     |
 *
 * f = suspended minutes of the employee's schedule / 480 (max 1). A suspension that does not touch
 * the employee's schedule (f = 0) gives nothing. Values are rounded to 3 decimals (ledger precision).
 */
import { WorkSuspensionType } from '@gscwd-api/models';

export const VACATION_LEAVE = 'Vacation Leave';
export const FORCED_LEAVE = 'Forced Leave';
export const SPECIAL_PRIVILEGE_LEAVE = 'Special Privilege Leave';
export const WELLNESS_LEAVE = 'Wellness Leave';
export const LEAVE_WITHOUT_PAY = 'Leave Without Pay';
export const SPECIAL_LEAVE_BENEFIT_TYPE = 'special leave benefit';

/** +0.5 VL for an approved half-day pass slip with complete logs on a suspension date (decided 2026-10-12). */
export const HALF_DAY_PASS_SLIP_ADD_BACK = 0.5;

export type AddBackEntry = {
  /** 'SAME' = the leave's own type */
  leave: 'SAME' | typeof VACATION_LEAVE;
  kind: 'credit' | 'debit';
  value: number;
};

export const round3 = (value: number) => Math.round((value + Number.EPSILON) * 1000) / 1000;

export function computeLeaveAddBack(
  leave: { leaveName: string; leaveTypes?: string | null },
  suspensionType: WorkSuspensionType,
  fraction: number
): AddBackEntry[] {
  if (suspensionType === WorkSuspensionType.LEGACY) return [];
  if (leave.leaveName === LEAVE_WITHOUT_PAY) return [];
  if ((leave.leaveTypes ?? '').toLowerCase() === SPECIAL_LEAVE_BENEFIT_TYPE) return [];

  const f = round3(Math.min(1, Math.max(0, fraction)));
  if (f === 0) return [];
  const whole = suspensionType === WorkSuspensionType.WHOLE_DAY || f === 1;

  switch (leave.leaveName) {
    case FORCED_LEAVE:
      return [
        { leave: 'SAME', kind: 'credit', value: 1 },
        { leave: VACATION_LEAVE, kind: 'credit', value: whole ? 1 : f },
      ];
    case SPECIAL_PRIVILEGE_LEAVE:
    case WELLNESS_LEAVE:
      return whole
        ? [{ leave: 'SAME', kind: 'credit', value: 1 }]
        : [
            { leave: 'SAME', kind: 'credit', value: 1 },
            { leave: VACATION_LEAVE, kind: 'debit', value: round3(1 - f) },
          ];
    default:
      return [{ leave: 'SAME', kind: 'credit', value: whole ? 1 : f }];
  }
}
