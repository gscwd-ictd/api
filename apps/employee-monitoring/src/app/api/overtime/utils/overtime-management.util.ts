/**
 * Management level employees cannot have overtime (HR, 2026-10-13): General Manager, Assistant General
 * Manager, Department Manager, Division Manager and their OIC counterparts.
 *
 * Source (hris), any of: plantilla_positions.position_title; employees.user_role (the General Manager has
 * no plantilla row in the 2026-10-13 dump); officer_in_charge (OIC of an office /
 * department / division head position). employee_temporary_assignment is a detail to another division
 * (staff positions in the data), not an OIC designation, so it does not make an employee management.
 *
 * Titles in plantilla_positions vary ("Department Manager A", " Department Manager A", "Department Manager A*"),
 * so they are compared after trimming, dropping trailing '*' and collapsing spaces, case-insensitive.
 */
export const MANAGEMENT_POSITION_TITLES = ['General Manager A', 'Assistant General Manager', 'Department Manager A', 'Division Manager A'] as const;

export function normalizePositionTitle(title: string | null | undefined): string {
  return (title ?? '').replace(/\*+\s*$/, '').replace(/\s+/g, ' ').trim().toLowerCase();
}

const NORMALIZED = new Set(MANAGEMENT_POSITION_TITLES.map(normalizePositionTitle));

export function isManagementPositionTitle(title: string | null | undefined): boolean {
  return NORMALIZED.has(normalizePositionTitle(title));
}

export const MANAGEMENT_USER_ROLES = [
  'general_manager',
  'oic_general_manager',
  'assistant_general_manager',
  'oic_assistant_general_manager',
  'department_manager',
  'oic_department_manager',
  'division_manager',
  'oic_division_manager',
] as const;

export type ManagementCheckRow = { positionTitle: string | null; userRole: string | null; isOic: number | string | boolean };

/** Why the employee is management level, or null when not. */
export function managementReason(row: ManagementCheckRow): string | null {
  if (isManagementPositionTitle(row.positionTitle)) return (row.positionTitle ?? '').replace(/\*+\s*$/, '').trim();
  if (row.isOic === true || Number(row.isOic) === 1) return 'Officer-in-Charge';
  if (row.userRole && (MANAGEMENT_USER_ROLES as readonly string[]).includes(row.userRole)) return row.userRole.replace(/_/g, ' ');
  return null;
}
