/**
 * Dates entered for overtime and schedules must be in an actual working year: last year, this year or next year.
 * Typos like 0026-03-07 or 0206-01-02 (the year lost a digit) were saved before and broke every face scan
 * (IVMS) lookup for them.
 */
export function actualYearRange(today = new Date()): { from: number; to: number } {
  const year = today.getFullYear();
  return { from: year - 1, to: year + 1 };
}

/** null when OK, otherwise the message to show */
export function checkActualYear(label: string, value: unknown, today = new Date()): string | null {
  if (value === undefined || value === null || value === '') return null;
  const text = value instanceof Date ? value.toISOString() : String(value);
  const match = /^(\d{1,4})-(\d{1,2})-(\d{1,2})/.exec(text);
  const year = match ? parseInt(match[1], 10) : NaN;
  const date = new Date(text);
  const { from, to } = actualYearRange(today);
  if (!match || isNaN(date.getTime()) || year < from || year > to) {
    return `${label} ${text.slice(0, 10)} is not valid. The year must be ${from} to ${to}; please check the year.`;
  }
  return null;
}
