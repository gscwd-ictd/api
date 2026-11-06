/**
 * Cuts a number to 2 decimals without the floating point error of Math.trunc(x * 100) / 100
 * (5.1 * 100 = 509.99999999999994, so that gave 5.09 instead of 5.10).
 */
export function truncate2(value: number): number {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return value;
  return Math.trunc(Number((Number(value) * 100).toFixed(6))) / 100;
}
