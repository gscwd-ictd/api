import { NatureOfBusiness } from '@gscwd-api/utils';
import {
  buildDetailedReport,
  buildSummaryReport,
  buildWellnessReport,
  PassSlipReportRow,
  passSlipReportParams,
  reportMinutes,
} from '../core/pass-slip-report.util';

const row = (r: Partial<PassSlipReportRow>): PassSlipReportRow => ({
  id: 'x',
  employeeId: 'e1',
  psDate: '2026-09-01',
  natureOfBusiness: NatureOfBusiness.PERSONAL,
  timeOut: '10:00:00',
  timeIn: '11:00:00',
  reason: null,
  scheduleTimeIn: '08:00:00',
  scheduleTimeOut: '17:00:00',
  lunchOut: '12:00:00',
  lunchIn: '13:00:00',
  ledgerDebit: null,
  ...r,
});
const names = new Map([['e1', 'Dela Cruz, Juan']]);

describe('pass slip report util', () => {
  it('excludes lunch', () => expect(reportMinutes(row({ timeOut: '11:30:00', timeIn: '13:30:00' }))).toBe(60));
  it('no IN -> schedule time out', () => expect(reportMinutes(row({ timeOut: '16:00:00', timeIn: null }))).toBe(60));
  it('Half Day / Undertime -> schedule time out', () => {
    expect(reportMinutes(row({ natureOfBusiness: NatureOfBusiness.HALF_DAY, timeOut: '13:00:00', timeIn: '13:05:00' }))).toBe(240);
    expect(reportMinutes(row({ natureOfBusiness: NatureOfBusiness.UNDERTIME, timeOut: '16:00:00', timeIn: null }))).toBe(60);
  });
  it('conversion uses the ledger debit when posted, else rounds up', () => {
    const [a, b] = buildDetailedReport([row({ timeOut: '10:00:00', timeIn: '11:26:00' }), row({ ledgerDebit: '0.179', timeIn: '11:26:00' })], names);
    expect(a.conversion).toBe('0.180');
    expect(b.conversion).toBe('0.179');
  });
  it('summary per employee; unknown employees left out', () => {
    const s = buildSummaryReport([row({}), row({ psDate: '2026-09-02' }), row({ employeeId: 'other' })], names);
    expect(s).toEqual([
      { employeeId: 'e1', name: 'Dela Cruz, Juan', noOfTimes: '2', dates: '2026-09-01, 2026-09-02', totalMinutes: '120.00', conversion: '0.250' },
    ]);
  });
  it('wellness: accumulated hours, excess per quarter', () => {
    const w = buildWellnessReport(
      [
        row({ natureOfBusiness: NatureOfBusiness.WELLNESS_PASS, psDate: '2026-01-05', timeOut: '08:00:00', timeIn: '11:00:00' }),
        row({ natureOfBusiness: NatureOfBusiness.WELLNESS_PASS, psDate: '2026-02-05', timeOut: '08:00:00', timeIn: '10:00:00' }),
        row({ natureOfBusiness: NatureOfBusiness.WELLNESS_PASS, psDate: '2026-04-05', timeOut: '08:00:00', timeIn: '10:00:00' }),
      ],
      names
    );
    expect(w[0].accumulatedHours).toBe('7.00');
    expect(w[0].excessMinutes).toBe(60);
    expect(w[0].dates).toBe('2026-01-05 (3.00 hrs), 2026-02-05 (2.00 hrs), 2026-04-05 (2.00 hrs)');
  });
  it('params cover the whole range by day', () =>
    expect(passSlipReportParams([NatureOfBusiness.PERSONAL], '2026-09-01', new Date('2026-09-30T00:00:00')).slice(-2)).toEqual([
      '2026-09-01',
      '2026-09-30',
    ]));
});
