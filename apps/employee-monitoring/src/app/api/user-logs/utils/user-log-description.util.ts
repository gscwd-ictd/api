/**
 * Turns a system log (HTTP method + route + request body) into a sentence a normal user understands,
 * e.g. PATCH /api/v1/pass-slip {status:'approved'} -> "Updated a pass slip (status: approved)".
 */

const VERBS: Record<string, string> = {
  POST: 'Added',
  PUT: 'Updated',
  PATCH: 'Updated',
  DELETE: 'Deleted',
  GET: 'Viewed',
};

/** route (without /api, /v1, ids) -> what was changed; longest match wins */
const SUBJECTS: Record<string, string> = {
  // EMS
  'custom-groups/members': 'custom group members',
  'custom-groups': 'a custom group',
  'daily-time-record/remarks': 'DTR remarks',
  'daily-time-record': 'a daily time record (DTR)',
  'dtr-correction': 'a time log correction',
  'employee-schedule/group': 'a group employee schedule',
  'employee-schedule': 'an employee schedule',
  'events-announcements': 'an event / announcement',
  holidays: 'a holiday',
  'leave-benefits': 'a leave benefit',
  'leave/adjustment': 'a leave credit adjustment',
  'leave/employee/leave-date-cancellation': 'a leave date cancellation',
  'leave/hrmo': 'a leave application (HRMO action)',
  leave: 'a leave application',
  'officer-of-the-day': 'an officer of the day',
  'overtime-immediate-supervisor': 'an overtime immediate supervisor',
  'overtime/immediate-supervisors': 'an overtime immediate supervisor',
  overtime: 'an overtime',
  'pass-slip/hr/cancel': 'a pass slip cancellation (HR)',
  'pass-slip/hr/time-record': 'a pass slip time record (HR)',
  'pass-slip': 'a pass slip',
  schedules: 'a schedule',
  'travel-order': 'a travel order',
  'user-roles': 'user role access',
  'work-suspension': 'a work suspension',
  // RSP / HRMS
  'applicant-endorsement': 'an applicant endorsement',
  applicant: 'an applicant status',
  'committee-members': 'committee members',
  committees: 'a committee',
  'competency-model-occupation': 'a competency model of an occupation',
  'competency-model': 'a competency model',
  'competency-proficiency-level': 'a competency proficiency level',
  divisions: 'a division',
  departments: 'a department',
  'duties-responsibilities': 'a duty / responsibility',
  'employees/details/basic': "an employee's basic details",
  employees: 'an employee',
  modules: 'a system module',
  'occupation-duties-responsibilities/occupation': 'duties / responsibilities of an occupation',
  'occupational-group': 'an occupational group',
  occupations: 'an occupation',
  office: 'an office',
  'officer-in-charge': 'an officer in charge',
  'plantilla-positions': 'a plantilla position',
  'position-description-form': 'a position description form',
  'qualification-standards/single': 'a qualification standard',
  'qualification-standards': 'qualification standards',
  'salary-grade/step-increment': 'the salary grade step increments',
  'salary-grade': 'the salary grade table',
  'temporary-assignment': 'a temporary assignment',
  'vacant-position-postings/appointment-effectivity': 'the appointment effectivity of a vacant position posting',
  'vacant-position-postings/psb': 'the PSB members of a vacant position posting',
  'vacant-position-postings': 'a vacant position posting',
  'nosi-nosa': 'a NOSI / NOSA',
};

const ID = /^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|\d[\d-]*)$/i;

function routeKey(route: string): string {
  const path = (route ?? '').split('?')[0];
  return path
    .split('/')
    .filter((p) => p && p !== 'api' && !/^v\d+$/.test(p) && !ID.test(p))
    .join('/');
}

function humanize(key: string): string {
  const words = key.split('/').pop()?.replace(/-/g, ' ').trim();
  return words ? `"${words}"` : 'a record';
}

function details(body: string | null | undefined): string {
  const extra: string[] = [];
  try {
    const data = body ? JSON.parse(body) : null;
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      const status = data.status ?? data.leaveStatus ?? data.hrmoApprovalStatus;
      if (typeof status === 'string' && status) extra.push(`status: ${status}`);
      const date = data.dtrDate ?? data.dateOfApplication ?? data.holidayDate ?? data.suspensionDate ?? data.dateFrom;
      if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}/.test(date)) extra.push(`date: ${date.slice(0, 10)}`);
    }
  } catch {
    // body is not JSON
  }
  return extra.length ? ` (${extra.join(', ')})` : '';
}

export function describeUserLog(method: string, route: string, body?: string | null): string {
  const verb = VERBS[(method ?? '').toUpperCase()] ?? 'Changed';
  const key = routeKey(route);
  const match = Object.keys(SUBJECTS)
    .filter((k) => key === k || key.startsWith(k + '/'))
    .sort((a, b) => b.length - a.length)[0];
  const subject = match ? SUBJECTS[match] : humanize(key);
  return `${verb} ${subject}${details(body)}`;
}
