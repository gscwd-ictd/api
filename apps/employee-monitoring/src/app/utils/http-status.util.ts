/**
 * HTTP status of a caught error, always a valid number (400-599); otherwise 500.
 * `new HttpException(error, error.message)` / `(error, error.status)` passed a string or an object as the status,
 * and Node's writeHead then threw "RangeError: Invalid status code: [object Object]", which stopped EMS BE.
 */
export function httpStatusOf(error: unknown): number {
  const e = error as { getStatus?: () => unknown; status?: unknown; statusCode?: unknown };
  const candidates = [typeof e?.getStatus === 'function' ? e.getStatus() : undefined, e?.status, e?.statusCode];
  const status = candidates.find((s) => Number.isInteger(s) && (s as number) >= 400 && (s as number) <= 599);
  return (status as number) ?? 500;
}
