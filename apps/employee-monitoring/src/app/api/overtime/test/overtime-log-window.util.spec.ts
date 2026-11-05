import { validateOvertimeLogWindow as v } from '../utils/overtime-log-window.util';

describe('validateOvertimeLogWindow', () => {
  const planned = '2026-10-28';
  it('same-day OT is fine', () => expect(v(planned, '2026-10-28 10:00', '2026-10-28 17:31')).toBeNull());
  it('overnight OT ending the next day is fine', () => expect(v(planned, '2026-10-28 19:00', '2026-10-29 07:00')).toBeNull());
  it('early-morning OT encoded on the planned date is fine', () => expect(v(planned, '2026-10-28 04:00', '2026-10-28 07:00')).toBeNull());
  it('start on another day is rejected (Silva 2026-10-28)', () =>
    expect(v(planned, '2026-10-29 10:00', '2026-10-29 17:31')).toMatch(/must be on the planned date/));
  it('start the day before is rejected', () => expect(v(planned, '2026-10-27 17:00', '2026-10-28 07:00')).toMatch(/must be on the planned date/));
  it('wrong month / year is rejected', () => {
    expect(v(planned, '2026-11-28 01:12', '2026-11-28 17:00')).toMatch(/must be on the planned date/);
    expect(v(planned, '1926-10-28 10:00', '1926-10-28 15:00')).toMatch(/must be on the planned date/);
  });
  it('end before the planned date is rejected', () => expect(v(planned, null, '2026-10-27 17:00')).toMatch(/on or after the planned date/));
  it('end typed a month later is rejected', () => expect(v(planned, '2026-10-28 10:00', '2026-11-28 17:00')).toMatch(/24 hours/));
  it('end before start is rejected', () => expect(v(planned, '2026-10-28 17:00', '2026-10-28 10:00')).toMatch(/after the overtime start/));
  it('missing logs are not checked', () => expect(v(planned, null, null)).toBeNull());
});
