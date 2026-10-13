import { WorkSuspensionType } from '@gscwd-api/models';
import { computeLeaveAddBack } from '../core/work-suspension-add-back.util';

const W = WorkSuspensionType.WHOLE_DAY;
const T = WorkSuspensionType.TIME_OF_DAY;
const leave = (leaveName: string, leaveTypes = 'cumulative') => ({ leaveName, leaveTypes });

describe('computeLeaveAddBack (spec table)', () => {
  it.each(['Vacation Leave', 'Sick Leave'])('%s: +1 whole day, +f time of day', (name) => {
    expect(computeLeaveAddBack(leave(name), W, 1)).toEqual([{ leave: 'SAME', kind: 'credit', value: 1 }]);
    expect(computeLeaveAddBack(leave(name), T, 0.125)).toEqual([{ leave: 'SAME', kind: 'credit', value: 0.125 }]);
  });

  it('Forced Leave: +1 FL +1 VL whole day, +1 FL +f VL time of day', () => {
    expect(computeLeaveAddBack(leave('Forced Leave'), W, 1)).toEqual([
      { leave: 'SAME', kind: 'credit', value: 1 },
      { leave: 'Vacation Leave', kind: 'credit', value: 1 },
    ]);
    expect(computeLeaveAddBack(leave('Forced Leave'), T, 0.625)).toEqual([
      { leave: 'SAME', kind: 'credit', value: 1 },
      { leave: 'Vacation Leave', kind: 'credit', value: 0.625 },
    ]);
  });

  it.each(['Special Privilege Leave', 'Wellness Leave'])('%s: +1 whole day; +1 and −(1−f) VL time of day', (name) => {
    expect(computeLeaveAddBack(leave(name), W, 1)).toEqual([{ leave: 'SAME', kind: 'credit', value: 1 }]);
    // spec example: SPL Oct 8, suspension 16:00, time out 17:00 → f = 0.125 → +1 SPL, −0.875 VL
    expect(computeLeaveAddBack(leave(name), T, 0.125)).toEqual([
      { leave: 'SAME', kind: 'credit', value: 1 },
      { leave: 'Vacation Leave', kind: 'debit', value: 0.875 },
    ]);
  });

  it('Special Leave Benefits and LWOP: nothing', () => {
    expect(computeLeaveAddBack(leave('Special Leave Benefits for Women', 'special leave benefit'), W, 1)).toEqual([]);
    expect(computeLeaveAddBack(leave('Leave Without Pay'), T, 0.5)).toEqual([]);
  });

  it('nothing when the suspension does not touch the schedule (f = 0) or is LEGACY', () => {
    expect(computeLeaveAddBack(leave('Special Privilege Leave'), T, 0)).toEqual([]);
    expect(computeLeaveAddBack(leave('Vacation Leave'), WorkSuspensionType.LEGACY, 1)).toEqual([]);
  });

  it('time of day covering the whole duty counts as whole day (no VL debit)', () => {
    expect(computeLeaveAddBack(leave('Special Privilege Leave'), T, 1)).toEqual([{ leave: 'SAME', kind: 'credit', value: 1 }]);
  });

  it('rounds to 3 decimals', () => {
    expect(computeLeaveAddBack(leave('Vacation Leave'), T, 100 / 480)).toEqual([{ leave: 'SAME', kind: 'credit', value: 0.208 }]);
    expect(computeLeaveAddBack(leave('Wellness Leave'), T, 100 / 480)[1]).toEqual({ leave: 'Vacation Leave', kind: 'debit', value: 0.792 });
  });
});
