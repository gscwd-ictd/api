import { WorkSuspensionType } from '@gscwd-api/models';
import { getSuspensionWindow } from '../core/work-suspension-window.util';
import { applyWorkSuspensionToDtr, DtrDayResult, toSortingSuspension } from '../core/work-suspension-dtr.util';

const tod = (t: string) => ({ suspensionType: WorkSuspensionType.TIME_OF_DAY, suspensionStartTime: t });
const whole = { suspensionType: WorkSuspensionType.WHOLE_DAY };

const s8to5 = { timeIn: '08:00:00', timeOut: '17:00:00', lunchOut: '12:00:00', lunchIn: '13:00:00' };
const s7to4 = { timeIn: '07:00:00', timeOut: '16:00:00', lunchOut: null, lunchIn: null };
const night = { timeIn: '22:00:00', timeOut: '06:00:00', lunchOut: null, lunchIn: null };

// a "normal" result that the suspension logic must replace
const base: DtrDayResult = { minutesLate: 99, noOfLates: 1, noOfUndertimes: 1, minutesUndertime: 99, noAttendance: 1, isHalfDay: true };

const logs = (timeIn: string | null, lunchOut: string | null, lunchIn: string | null, timeOut: string | null) => ({ timeIn, lunchOut, lunchIn, timeOut });

const run = (suspension, schedule, l) => applyWorkSuspensionToDtr(getSuspensionWindow(suspension, schedule), schedule, l, base);

describe('applyWorkSuspensionToDtr — day shift 8-5, suspension 15:00', () => {
  const s = tod('15:00');
  it('complete day, left at 15:00 → nothing', () => {
    expect(run(s, s8to5, logs('07:55', '12:00', '13:00', '15:00'))).toEqual({
      minutesLate: 0, noOfLates: 0, noOfUndertimes: 0, minutesUndertime: 0, noAttendance: 0, isHalfDay: false,
    });
  });
  it('late 08:20 → 20 min late, leaving at 15:00 is fine', () => {
    expect(run(s, s8to5, logs('08:20', '12:00', '13:00', '15:00'))).toMatchObject({ minutesLate: 20, noOfLates: 1, minutesUndertime: 0 });
  });
  it('left 14:30 → 30 min undertime (relative to the suspension start)', () => {
    expect(run(s, s8to5, logs('08:00', '12:00', '13:00', '14:30'))).toMatchObject({ minutesUndertime: 30, noOfUndertimes: 1, isHalfDay: false });
  });
  it('lunch in 13:45 → 16 min late after the 29 min grace', () => {
    expect(run(s, s8to5, logs('08:00', '12:00', '13:45', '15:00'))).toMatchObject({ minutesLate: 16, noOfLates: 1 });
  });
  it('arrived 15:10 (after start) → not late, not absent', () => {
    expect(run(s, s8to5, logs('15:10', null, null, '17:00'))).toEqual({
      minutesLate: 0, noOfLates: 0, noOfUndertimes: 0, minutesUndertime: 0, noAttendance: 0, isHalfDay: false,
    });
  });
  it('left 11:00 → half day, 60 min morning undertime', () => {
    expect(run(s, s8to5, logs('08:00', null, null, '11:00'))).toMatchObject({ isHalfDay: true, minutesUndertime: 60, noOfUndertimes: 1 });
  });
  it('came in 13:00 → half day, not late', () => {
    expect(run(s, s8to5, logs('13:00', null, null, '15:00'))).toMatchObject({ isHalfDay: true, minutesLate: 0, noOfLates: 1 });
  });
  it('no logs → keeps the normal absence flag only', () => {
    expect(run(s, s8to5, logs(null, null, null, null))).toEqual({ ...{ minutesLate: 0, noOfLates: 0, noOfUndertimes: 0, minutesUndertime: 0, isHalfDay: false }, noAttendance: 1 });
  });
  it('incomplete logs → normal result', () => {
    expect(run(s, s8to5, logs('08:00', '12:00', null, null))).toEqual(base);
  });
});

describe('applyWorkSuspensionToDtr — other cases', () => {
  it('12:00 on a 7-4 schedule without lunch (lunch 11-12): leaving at 11:00 is not a half day or undertime', () => {
    expect(run(tod('12:00'), s7to4, logs('07:00', null, null, '11:00'))).toMatchObject({ isHalfDay: false, minutesUndertime: 0, noOfUndertimes: 0 });
  });
  it('12:00 on 7-4: leaving at 10:30 → 30 min undertime', () => {
    expect(run(tod('12:00'), s7to4, logs('07:00', null, null, '10:30'))).toMatchObject({ minutesUndertime: 30 });
  });
  it('whole day → nothing, even with no logs', () => {
    expect(run(whole, s8to5, logs(null, null, null, null))).toEqual({
      minutesLate: 0, noOfLates: 0, noOfUndertimes: 0, minutesUndertime: 0, noAttendance: 0, isHalfDay: false,
    });
  });
  it('suspension after time out → normal result', () => {
    expect(run(tod('18:00'), s8to5, logs('08:30', '12:00', '13:00', '17:00'))).toEqual(base);
  });
  it('night 22-06, suspension 15:00: arriving by midnight is not late', () => {
    expect(run(tod('15:00'), night, logs('23:50', null, null, '06:00'))).toMatchObject({ minutesLate: 0, minutesUndertime: 0, isHalfDay: false });
  });
  it('night 22-06: arriving 00:20 → 20 min late', () => {
    expect(run(tod('15:00'), night, logs('00:20', null, null, '06:00'))).toMatchObject({ minutesLate: 20, noOfLates: 1 });
  });
  it('night 22-06: leaving 05:00 → 60 min undertime', () => {
    expect(run(whole, night, logs('22:00', null, null, '05:00'))).toMatchObject({ minutesUndertime: 60, noOfUndertimes: 1 });
  });
  it('LEGACY → normal result', () => {
    expect(run({ suspensionType: WorkSuspensionType.LEGACY }, s8to5, logs('09:00', null, null, '12:00'))).toEqual(base);
  });
});

describe('toSortingSuspension', () => {
  it('day shift: hours from suspension start to time out', () => {
    expect(toSortingSuspension(getSuspensionWindow(tod('15:00'), s8to5), s8to5)).toEqual({ suspensionHours: 2, startMinutes: 900 });
  });
  it('night shift: time-out slot unchanged', () => {
    expect(toSortingSuspension(getSuspensionWindow(tod('15:00'), night), night)).toEqual({ suspensionHours: 0, startMinutes: null });
  });
  it('no suspension: 0', () => {
    expect(toSortingSuspension(getSuspensionWindow(null, s8to5), s8to5)).toEqual({ suspensionHours: 0, startMinutes: null });
  });
});
