import { WorkSuspensionType } from '@gscwd-api/models';
import { getSuspensionWindow, resolveLunchWindow } from '../core/work-suspension-window.util';

const tod = (t: string) => ({ suspensionType: WorkSuspensionType.TIME_OF_DAY, suspensionStartTime: t });
const whole = { suspensionType: WorkSuspensionType.WHOLE_DAY };

const sched7to4NoLunch = { timeIn: '07:00:00', timeOut: '16:00:00', lunchOut: null, lunchIn: null };
const sched8to5 = { timeIn: '08:00:00', timeOut: '17:00:00', lunchOut: '12:00:00', lunchIn: '13:00:00' };
const night22to6 = { timeIn: '22:00:00', timeOut: '06:00:00', lunchOut: null, lunchIn: null };
const swing14to22 = { timeIn: '14:00:00', timeOut: '22:00:00', lunchOut: null, lunchIn: null };

describe('resolveLunchWindow', () => {
  it('uses the schedule lunch when set', () => {
    expect(resolveLunchWindow(sched8to5)).toEqual({ start: 720, end: 780 });
  });
  it('defaults to the 5th hour of duty when there is no lunch', () => {
    expect(resolveLunchWindow(sched7to4NoLunch)).toEqual({ start: 660, end: 720 });
  });
  it('defaults to the 5th hour for night shifts (02:00 - 03:00 next day)', () => {
    expect(resolveLunchWindow(night22to6)).toEqual({ start: 1560, end: 1620 });
  });
  it('maps an after-midnight schedule lunch onto the night timeline', () => {
    expect(resolveLunchWindow({ ...night22to6, lunchOut: '01:00:00', lunchIn: '02:00:00' })).toEqual({ start: 1500, end: 1560 });
  });
  it('treats lunch longer than 3 hours as bad data', () => {
    expect(resolveLunchWindow({ timeIn: '07:00:00', timeOut: '16:00:00', lunchOut: '11:00:00', lunchIn: '23:31:00' })).toEqual({ start: 660, end: 720 });
  });
});

describe('getSuspensionWindow — spec examples', () => {
  it('7-4 no lunch, 12:00 -> 240 min, f 0.5', () => {
    const w = getSuspensionWindow(tod('12:00'), sched7to4NoLunch);
    expect(w).toMatchObject({ isSuspended: true, start: 720, end: 1440, suspendedMinutes: 240, fraction: 0.5, ndSuspendedMinutes: 0 });
  });
  it('7-4 no lunch, 10:00 -> 300 min, f 0.625', () => {
    expect(getSuspensionWindow(tod('10:00'), sched7to4NoLunch)).toMatchObject({ suspendedMinutes: 300, fraction: 0.625 });
  });
  it('8-5 lunch 12-1, 16:00 -> 60 min, f 0.125', () => {
    expect(getSuspensionWindow(tod('16:00:00'), sched8to5)).toMatchObject({ suspendedMinutes: 60, fraction: 0.125 });
  });
  it('22-06 no lunch, 15:00 -> only 22-24 suspended, f 0.25, all ND', () => {
    expect(getSuspensionWindow(tod('15:00'), night22to6)).toMatchObject({ suspendedMinutes: 120, fraction: 0.25, ndSuspendedMinutes: 120 });
  });
});

describe('getSuspensionWindow — other cases', () => {
  it('whole day on a day shift suspends the full duty (f 1)', () => {
    expect(getSuspensionWindow(whole, sched8to5)).toMatchObject({ start: 480, suspendedMinutes: 480, fraction: 1 });
  });
  it('whole day on a night shift only suspends up to midnight', () => {
    expect(getSuspensionWindow(whole, night22to6)).toMatchObject({ start: 1320, suspendedMinutes: 120, fraction: 0.25, ndSuspendedMinutes: 120 });
  });
  it('suspension after time out suspends nothing but is still a suspension day', () => {
    expect(getSuspensionWindow(tod('18:00'), sched8to5)).toMatchObject({ isSuspended: true, suspendedMinutes: 0, fraction: 0 });
  });
  it('suspension inside lunch starts counting after lunch', () => {
    expect(getSuspensionWindow(tod('12:30'), sched8to5)).toMatchObject({ suspendedMinutes: 240, fraction: 0.5 });
  });
  it('swing shift 14-22 (lunch 18-19), 17:00 -> 17-18 + 19-22 = 240, ND 18-22 = 240 (lunch not excluded)', () => {
    expect(getSuspensionWindow(tod('17:00'), swing14to22)).toMatchObject({ suspendedMinutes: 240, fraction: 0.5, ndSuspendedMinutes: 240 });
  });
  it('LEGACY and missing suspensions are not handled here', () => {
    expect(getSuspensionWindow({ suspensionType: WorkSuspensionType.LEGACY }, sched8to5).isSuspended).toBe(false);
    expect(getSuspensionWindow(null, sched8to5).isSuspended).toBe(false);
  });
  it('TIME_OF_DAY without a start time throws', () => {
    expect(() => getSuspensionWindow({ suspensionType: WorkSuspensionType.TIME_OF_DAY }, sched8to5)).toThrow();
  });
});
