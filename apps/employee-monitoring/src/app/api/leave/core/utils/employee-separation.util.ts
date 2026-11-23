import { ForbiddenException } from '@nestjs/common';
import dayjs = require('dayjs');

type Query = (sql: string, params?: unknown[]) => Promise<unknown>;

export type EmployeeSeparation = { effectivityDate: string; reason: string };

/**
 * Separation from HRMS nosi_nosa: the employee's latest record is 'inactive' (resigned, retired, deceased, ...)
 * with an effectivity date on or before `onDate` (default today). Null when the employee is active.
 */
export async function getEmployeeSeparation(query: Query, employeeId: string, onDate?: Date | string): Promise<EmployeeSeparation | null> {
  const rows = (await query(
    `SELECT DATE_FORMAT(nn.effectivity_date, '%Y-%m-%d') effectivityDate, nn.inactive_reason inactiveReason
       FROM ${process.env.HRMS_DB_NAME}nosi_nosa nn
      WHERE nn.employee_id_fk = ? AND nn.status = 'inactive' AND nn.effectivity_date <= ?
        AND nn.effectivity_date = (SELECT MAX(nn2.effectivity_date) FROM ${process.env.HRMS_DB_NAME}nosi_nosa nn2 WHERE nn2.employee_id_fk = nn.employee_id_fk)
      LIMIT 1;`,
    [employeeId, dayjs(onDate ?? new Date()).format('YYYY-MM-DD')]
  )) as { effectivityDate: string; inactiveReason: string | null }[];
  if (!rows?.length) return null;
  return { effectivityDate: rows[0].effectivityDate, reason: (rows[0].inactiveReason ?? 'separation').replace(/_/g, ' ') };
}

/** separated employees get no more leave credits and cannot file leave (their leave ledger has ended) */
export async function assertNotSeparated(query: Query, employeeId: string, action: string, onDate?: Date | string) {
  const separation = await getEmployeeSeparation(query, employeeId, onDate);
  if (separation)
    throw new ForbiddenException(
      `${action} is not allowed: the employee is separated (${separation.reason} effective ${dayjs(separation.effectivityDate).format(
        'MMM DD, YYYY'
      )}). The leave ledger has ended.`
    );
}
