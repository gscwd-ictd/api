import { clipOvertimeStartToSuspension, splitOvertimeBySuspension } from '../utils/overtime-suspension.util';

describe('splitOvertimeBySuspension', () => {
  const date = '2026-10-08';

  it('keeps everything regular when the date is not suspended', () => {
    expect(splitOvertimeBySuspension(3, '2026-10-08 17:00', '2026-10-08 20:00', date, null)).toEqual({ regularHrs: 3, suspensionHrs: 0 });
  });

  it('OT fully after a 15:00 suspension start is all suspension OT', () => {
    expect(splitOvertimeBySuspension(3, '2026-10-08 17:00', '2026-10-08 20:00', date, 15 * 60)).toEqual({ regularHrs: 0, suspensionHrs: 3 });
  });

  it('splits OT that starts before the suspension start', () => {
    // 06:00-08:00 regular before a 07:00 start -> 1h regular, 1h suspension
    expect(splitOvertimeBySuspension(2, '2026-10-08 06:00', '2026-10-08 08:00', date, 7 * 60)).toEqual({ regularHrs: 1, suspensionHrs: 1 });
  });

  it('stops the suspension window at midnight', () => {
    // 22:00-02:00 next day -> 2h suspension (before midnight), 2h regular
    expect(splitOvertimeBySuspension(4, '2026-10-08 22:00', '2026-10-09 02:00', date, 12 * 60)).toEqual({ regularHrs: 2, suspensionHrs: 2 });
  });

  it('splits rendered hours proportionally when the > 4h deduction applied', () => {
    // 16:00-22:00 = 6h logged, 5h credited, suspension from 19:00 -> half the log is inside
    expect(splitOvertimeBySuspension(5, '2026-10-08 16:00', '2026-10-08 22:00', date, 19 * 60)).toEqual({ regularHrs: 2.5, suspensionHrs: 2.5 });
  });

  it('keeps everything regular without OT logs or hours', () => {
    expect(splitOvertimeBySuspension(3, null, null, date, 12 * 60)).toEqual({ regularHrs: 3, suspensionHrs: 0 });
    expect(splitOvertimeBySuspension(null, '2026-10-08 17:00', '2026-10-08 20:00', date, 12 * 60)).toEqual({ regularHrs: 0, suspensionHrs: 0 });
  });
});

describe('splitOvertimeBySuspension — WHOLE_DAY (window 00:00 -> 24:00)', () => {
  it('early-morning OT on a whole day suspension is all suspension OT', () => {
    expect(splitOvertimeBySuspension(2, '2026-10-08 05:00', '2026-10-08 07:00', '2026-10-08', 0)).toEqual({ regularHrs: 0, suspensionHrs: 2 });
  });

  it('OT that crosses into the next day is suspension OT only until midnight', () => {
    expect(splitOvertimeBySuspension(3, '2026-10-08 23:00', '2026-10-09 02:00', '2026-10-08', 0)).toEqual({ regularHrs: 2, suspensionHrs: 1 });
  });
});

describe('clipOvertimeStartToSuspension (TIME_OF_DAY)', () => {
  const at = (d: Date | null) => (d ? `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}` : null);
  it('log straddling the suspension start begins at the start (Servano 07:54-17:00, from 10:00)', () =>
    expect(at(clipOvertimeStartToSuspension('2026-10-28 07:54', '2026-10-28 17:00', '2026-10-28', 600))).toBe('10:00'));
  it('log after the start is unchanged', () =>
    expect(at(clipOvertimeStartToSuspension('2026-10-28 12:00', '2026-10-28 17:38', '2026-10-28', 600))).toBe('12:00'));
  it('log fully before the start (early-morning OT) is unchanged', () =>
    expect(at(clipOvertimeStartToSuspension('2026-10-28 04:00', '2026-10-28 07:00', '2026-10-28', 600))).toBe('4:00'));
  it('not suspended -> unchanged', () =>
    expect(at(clipOvertimeStartToSuspension('2026-10-28 07:54', '2026-10-28 17:00', '2026-10-28', null))).toBe('7:54'));
});
