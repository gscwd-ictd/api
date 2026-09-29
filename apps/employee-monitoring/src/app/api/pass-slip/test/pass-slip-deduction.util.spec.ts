import { NatureOfBusiness } from '@gscwd-api/utils';
import { computeDeductibleMinutes, minutesToCredits, getLunchBreak, quarterStart } from '../core/pass-slip-deduction.util';

const regular = { timeIn: '08:00:00', timeOut: '17:00:00', lunchOut: '12:00:00', lunchIn: '13:00:00' };
const earlyLunch = { timeIn: '08:00:00', timeOut: '17:00:00', lunchOut: '11:00:00', lunchIn: '12:00:00' };
const noLunch = { timeIn: '08:00:00', timeOut: '17:00:00', lunchOut: null, lunchIn: null };
const credits = (n: NatureOfBusiness, out: string, back: string | null, schedule = regular, used = 0) =>
  minutesToCredits(computeDeductibleMinutes({ natureOfBusiness: n, timeOut: out, timeIn: back, schedule, wellnessMinutesUsedThisQuarter: used }));

describe('pass slip deductions', () => {
  it('rounds up to 3 decimals', () => {
    expect(minutesToCredits(30)).toBe(0.063); // 0.0625
    expect(minutesToCredits(60)).toBe(0.125);
    expect(minutesToCredits(0)).toBe(0);
  });

  it('drops seconds', () => {
    expect(credits(NatureOfBusiness.PERSONAL, '15:00:39', '17:00:00')).toBe(0.25);
  });

  describe('Personal Business', () => {
    it('rule example: 10:30-11:30 with 11-12 lunch = 30 min', () => {
      expect(credits(NatureOfBusiness.PERSONAL, '10:30:00', '11:30:00', earlyLunch)).toBe(0.063);
    });
    it('spans whole lunch', () => {
      expect(credits(NatureOfBusiness.PERSONAL, '11:00:00', '14:00:00')).toBe(0.25); // 120 min
    });
    it('inside lunch only = 0', () => {
      expect(credits(NatureOfBusiness.PERSONAL, '12:05:00', '12:50:00')).toBe(0);
    });
    it('missing IN uses schedule time out', () => {
      expect(credits(NatureOfBusiness.PERSONAL, '15:00:00', null)).toBe(0.25);
    });
  });

  describe('Half Day', () => {
    it('base 0.500', () => expect(credits(NatureOfBusiness.HALF_DAY, '13:00:00', null)).toBe(0.5));
    it('rule example: out 11:00 with 12-1 lunch = 0.625', () => expect(credits(NatureOfBusiness.HALF_DAY, '11:00:00', null)).toBe(0.625));
    it('no lunch assigned -> break 4h after time in', () => {
      expect(getLunchBreak(noLunch)).toEqual({ start: 720, end: 780 });
      expect(credits(NatureOfBusiness.HALF_DAY, '11:00:00', null, noLunch)).toBe(0.625);
    });
  });

  describe('Undertime', () => {
    it('afternoon', () => expect(credits(NatureOfBusiness.UNDERTIME, '16:00:00', null)).toBe(0.125));
    it('crosses lunch -> lunch excluded', () => expect(credits(NatureOfBusiness.UNDERTIME, '11:00:00', null)).toBe(0.625)); // 360-60=300
    it('out during lunch', () => expect(credits(NatureOfBusiness.UNDERTIME, '12:30:00', null)).toBe(0.5)); // 13-17
  });

  it('Official Business never deducts', () => {
    expect(credits(NatureOfBusiness.OFFICIAL_BUSINESS, '08:00:00', '17:00:00')).toBe(0);
  });

  describe('Wellness Pass (240 min / quarter)', () => {
    it('within allowance', () => expect(credits(NatureOfBusiness.WELLNESS_PASS, '14:00:00', '16:00:00')).toBe(0));
    it('only the excess over allowance', () => {
      expect(credits(NatureOfBusiness.WELLNESS_PASS, '14:00:00', '16:00:00', regular, 180)).toBe(0.125); // 120 - 60 left
    });
    it('allowance already used up', () => {
      expect(credits(NatureOfBusiness.WELLNESS_PASS, '14:00:00', '15:00:00', regular, 300)).toBe(0.125);
    });
    it('lunch not counted', () => {
      expect(credits(NatureOfBusiness.WELLNESS_PASS, '09:00:00', '15:00:00')).toBe(0.125); // 300 - 240
    });
  });

  it('quarter start', () => {
    expect(quarterStart('2026-09-29T10:00:00')).toBe('2026-07-01');
    expect(quarterStart('2026-01-05T10:00:00')).toBe('2026-01-01');
  });
});
