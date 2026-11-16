import { checkActualYear } from '../actual-year.util';

describe('checkActualYear', () => {
  const today = new Date('2026-11-16T08:00:00');
  it('accepts last year, this year and next year', () => {
    for (const d of ['2025-01-02', '2026-11-16', '2027-12-31', '2026-03-07T00:00:00.000Z']) expect(checkActualYear('Date', d, today)).toBeNull();
  });
  it('rejects typo years', () => {
    for (const d of ['0026-03-07', '0206-01-02', '0005-02-01', '2206-01-02', '1926-05-01', '2028-01-01']) expect(checkActualYear('Planned date', d, today)).toMatch(/2025 to 2027/);
  });
  it('rejects invalid dates', () => expect(checkActualYear('Date', 'Invalid Date', today)).toMatch(/not valid/));
  it('skips empty values', () => expect(checkActualYear('Date', undefined, today)).toBeNull());
});
