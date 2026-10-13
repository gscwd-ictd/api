import { isManagementPositionTitle, managementReason } from '../utils/overtime-management.util';

describe('management level (no overtime)', () => {
  it.each(['General Manager A', 'Assistant General Manager', 'Department Manager A', ' Department Manager A', 'Department Manager A*', 'division manager a'])(
    'title "%s" is management',
    (title) => expect(isManagementPositionTitle(title)).toBe(true)
  );

  it.each(['Water Maintenance Head', 'General Services Officer A', 'Water Maintenance General Foreman', 'Principal Engineer C', null, ''])(
    'title "%s" is not management',
    (title) => expect(isManagementPositionTitle(title)).toBe(false)
  );

  it('OIC (officer_in_charge) with a staff title is management', () => {
    expect(managementReason({ positionTitle: 'Principal Engineer C', userRole: 'rank_and_file', isOic: '1' })).toBe('Officer-in-Charge');
  });

  it('General Manager by user_role even without a plantilla row', () => {
    expect(managementReason({ positionTitle: null, userRole: 'general_manager', isOic: 0 })).toBe('general manager');
  });

  it('rank and file / job order are not management', () => {
    expect(managementReason({ positionTitle: 'Customer Service Officer A', userRole: 'rank_and_file', isOic: 0 })).toBeNull();
    expect(managementReason({ positionTitle: null, userRole: 'job_order', isOic: '0' })).toBeNull();
  });

  it('reason uses the cleaned title', () => {
    expect(managementReason({ positionTitle: 'Department Manager A*', userRole: 'rank_and_file', isOic: 0 })).toBe('Department Manager A');
  });
});
