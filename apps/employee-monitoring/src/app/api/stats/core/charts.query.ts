/**
 * SQL for the EMS Charts page (tardiness, undertime, leave types, LWOP, pass slip types, time log corrections, overtime).
 * Every chart counts "events" of one year and groups them per office / department / division of the employee's
 * current plantilla position (HRMS). Only whitelisted values reach the SQL text; everything else is a bound parameter.
 */

export const CHART_TYPES = ['tardiness', 'undertime', 'leave', 'lwop', 'pass-slip', 'tlc', 'overtime'] as const;
export type ChartType = (typeof CHART_TYPES)[number];

export const ORG_LEVELS = ['office', 'department', 'division'] as const;
export type OrgLevel = (typeof ORG_LEVELS)[number];

export const PASS_SLIP_TYPES = ['Personal Business', 'Official Business', 'Half Day', 'Undertime', 'Wellness Pass'];
const LWOP = 'Leave Without Pay';

type EventQuery = { sql: string; key: 'employee_id' | 'company_id'; params: unknown[] };

/** one row per counted event: (employee_id or company_id, category) */
function eventQuery(type: ChartType, year: number): EventQuery {
  switch (type) {
    case 'tardiness':
    case 'undertime':
      return {
        key: 'company_id',
        sql: `SELECT dtr.company_id_fk company_id, NULL category
                FROM leave_card_ledger_debit l
                JOIN daily_time_record dtr ON dtr.daily_time_record_id = l.daily_time_record_id_fk
               WHERE l.deleted_at IS NULL AND l.dtr_deduction_type = ? AND YEAR(dtr.dtr_date) = ?`,
        params: [type === 'tardiness' ? 'Tardiness' : 'Undertime', year],
      };
    case 'leave':
    case 'lwop':
      return {
        key: 'employee_id',
        sql: `SELECT la.employee_id_fk employee_id, lb.leave_name category
                FROM leave_application la
                JOIN leave_benefits lb ON lb.leave_benefits_id = la.leave_benefits_id_fk
               WHERE la.deleted_at IS NULL AND la.status = 'approved' AND YEAR(la.date_of_filing) = ?
                 AND lb.leave_name ${type === 'lwop' ? '=' : '<>'} ?`,
        params: [year, LWOP],
      };
    case 'pass-slip':
      return {
        key: 'employee_id',
        sql: `SELECT ps.employee_id_fk employee_id, ps.nature_of_business category
                FROM pass_slip ps
                JOIN pass_slip_approval psa ON psa.pass_slip_id_fk = ps.pass_slip_id
               WHERE ps.deleted_at IS NULL AND psa.status LIKE 'approved%' AND YEAR(ps.date_of_application) = ?
                 AND ps.nature_of_business IN (?, ?, ?, ?, ?)`,
        params: [year, ...PASS_SLIP_TYPES],
      };
    case 'tlc':
      return {
        key: 'company_id',
        sql: `SELECT dtr.company_id_fk company_id, NULL category
                FROM dtr_correction c
                JOIN daily_time_record dtr ON dtr.daily_time_record_id = c.daily_time_record_id_fk
               WHERE c.deleted_at IS NULL AND YEAR(dtr.dtr_date) = ?`,
        params: [year],
      };
    case 'overtime':
      return {
        key: 'employee_id',
        sql: `SELECT oe.employee_id_fk employee_id, NULL category
                FROM overtime_accomplishment oacc
                JOIN overtime_employee oe ON oe.overtime_employee_id = oacc.overtime_employee_id_fk
                JOIN overtime_application oa ON oa.overtime_application_id = oe.overtime_application_id_fk
               WHERE oacc.deleted_at IS NULL AND oacc.status = 'approved' AND YEAR(oa.planned_date) = ?`,
        params: [year],
      };
  }
}

/** employee -> office / department / division (division falls back to department, department to office) */
function orgMapSql(db: string) {
  return `SELECT e._id employee_id, e.company_id,
                 o._id office_id, o.code office_code, o.name office_name,
                 COALESCE(d._id, o._id) department_id, COALESCE(d.code, o.code) department_code, COALESCE(d.name, o.name) department_name,
                 COALESCE(dv._id, d._id, o._id) division_id, COALESCE(dv.code, d.code, o.code) division_code,
                 COALESCE(dv.name, d.name, o.name) division_name
            FROM ${db}employees e
            JOIN ${db}plantilla_positions pp ON pp.employee_id_fk = e._id
            LEFT JOIN ${db}division_positions dvp ON dvp.position_id_fk = pp._id
            LEFT JOIN ${db}divisions dv ON dv._id = dvp.division_id_fk
            LEFT JOIN ${db}department_positions dpp ON dpp.position_id_fk = pp._id
            LEFT JOIN ${db}departments d ON d._id = COALESCE(dpp.department_id_fk, dv.department_id_fk)
            LEFT JOIN ${db}office_positions opp ON opp.position_id_fk = pp._id
            LEFT JOIN ${db}office o ON o._id = COALESCE(opp.office_id_fk, d.office_id_fk)
           WHERE o._id IS NOT NULL`;
}

function base(type: ChartType, level: OrgLevel, year: number, db: string) {
  const ev = eventQuery(type, year);
  return {
    from: `FROM (${ev.sql}) ev JOIN (${orgMapSql(db)}) m ON m.${ev.key} = ev.${ev.key}`,
    params: ev.params,
    org: { id: `m.${level}_id`, code: `m.${level}_code`, name: `m.${level}_name` },
  };
}

/** counts per org (and category) -> chart bars */
export function chartCountsQuery(type: ChartType, level: OrgLevel, year: number, db: string) {
  const b = base(type, level, year, db);
  return {
    sql: `SELECT ${b.org.id} orgId, ${b.org.code} orgCode, ${b.org.name} orgName, ev.category, COUNT(*) count
            ${b.from}
           GROUP BY ${b.org.id}, ${b.org.code}, ${b.org.name}, ev.category
           ORDER BY count DESC`,
    params: b.params,
  };
}

/** counts per employee (and category); optionally only one org and / or one category -> modals and top tables */
export function chartEmployeesQuery(
  type: ChartType,
  level: OrgLevel,
  year: number,
  db: string,
  orgId?: string,
  category?: string
) {
  const b = base(type, level, year, db);
  const where: string[] = [];
  const params = [...b.params];
  if (orgId) {
    where.push(`${b.org.id} = ?`);
    params.push(orgId);
  }
  if (category) {
    where.push('ev.category = ?');
    params.push(category);
  }
  return {
    sql: `SELECT m.employee_id employeeId, m.company_id companyId, ${db}get_employee_fullname2(m.employee_id) fullName,
                 ${b.org.name} orgName, ev.category, COUNT(*) count
            ${b.from}
           ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
           GROUP BY m.employee_id, m.company_id, ${b.org.name}, ev.category
           ORDER BY count DESC`,
    params,
  };
}
