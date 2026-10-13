import {
  LeaveAddBack,
  LeaveBenefits,
  LeaveCardLedgerCredit,
  LeaveCardLedgerDebit,
  LeaveCreditDeductions,
  LeaveCreditEarnings,
  WorkSuspension,
  WorkSuspensionType,
} from '@gscwd-api/models';
import { WorkSuspensionAddBackService } from '../core/work-suspension-add-back.service';

const WS_ID = 'ws-1';
const s8to5 = { timeIn: '08:00:00', timeOut: '17:00:00', lunchOut: '12:00:00', lunchIn: '13:00:00' };

const benefits: Record<string, { id: string; leaveName: string; leaveTypes: string }> = {
  vl: { id: 'vl', leaveName: 'Vacation Leave', leaveTypes: 'cumulative' },
  sl: { id: 'sl', leaveName: 'Sick Leave', leaveTypes: 'cumulative' },
  fl: { id: 'fl', leaveName: 'Forced Leave', leaveTypes: 'non-cumulative' },
  spl: { id: 'spl', leaveName: 'Special Privilege Leave', leaveTypes: 'non-cumulative' },
};

/** In-memory stand-in for the TypeORM EntityManager / DataSource used by the service. */
function makeHarness(opts: { leaves?: { lad: string; employee: string; benefit: string }[]; passSlips?: { ps: string; employee: string }[] }) {
  const rows = new Map<unknown, Record<string, unknown>[]>([
    [LeaveAddBack, []],
    [LeaveCreditEarnings, []],
    [LeaveCreditDeductions, []],
    [LeaveCardLedgerCredit, []],
    [LeaveCardLedgerDebit, []],
  ]);
  let seq = 0;
  const matches = (row: Record<string, unknown>, where: Record<string, unknown>) =>
    Object.entries(where).every(([k, v]) => {
      const value = row[k] as Record<string, unknown> | undefined;
      if (v && typeof v === 'object' && 'id' in (v as object)) {
        const cond = (v as { id: unknown }).id;
        if (cond && typeof cond === 'object' && '_value' in (cond as object)) return ((cond as { _value: unknown[] })._value).includes(value?.id);
        return value?.id === cond;
      }
      if (v && typeof v === 'object' && '_value' in (v as object)) return ((v as { _value: unknown[] })._value).includes(row[k]);
      return row[k] === v;
    });
  const manager = {
    create: (_entity: unknown, data: Record<string, unknown>) => ({ ...data, __entity: _entity }),
    save: async (data: Record<string, unknown>) => {
      const saved = { ...data, id: `id-${++seq}` };
      rows.get(data.__entity).push(saved);
      return saved;
    },
    count: async (entity: unknown, { where }) => rows.get(entity).filter((r) => matches(r, where)).length,
    find: async (entity: unknown, { where }) => rows.get(entity).filter((r) => matches(r, where)),
    delete: async (entity: unknown, where: Record<string, unknown>) => {
      const keep = rows.get(entity).filter((r) => !matches(r, where));
      rows.set(entity, keep);
    },
    findOne: async (_e: unknown, { where }) => Object.values(benefits).find((b) => b.leaveName === where.leaveName) ?? null,
    findOneOrFail: async (_e: unknown, { where }) => Object.values(benefits).find((b) => b.id === where.id),
  };
  const dataSource = {
    transaction: async (fn: (m: typeof manager) => unknown) => fn(manager),
    query: async (sql: string) => {
      if (sql.includes('FROM leave_application_dates'))
        return (opts.leaves ?? []).map((l) => ({
          leaveApplicationDateId: l.lad,
          employeeId: l.employee,
          leaveBenefitsId: benefits[l.benefit].id,
          leaveName: benefits[l.benefit].leaveName,
          leaveTypes: benefits[l.benefit].leaveTypes,
        }));
      if (sql.includes('FROM pass_slip')) return (opts.passSlips ?? []).map((p) => ({ passSlipId: p.ps, employeeId: p.employee }));
      return [];
    },
  };
  const employeeScheduleService = { getEmployeeScheduleByDtrDateForLeaveAddback: async () => ({ schedule: s8to5 }) };
  const service = new WorkSuspensionAddBackService(dataSource as never, {} as never, employeeScheduleService as never);
  return { service, rows };
}

const suspension = (type: WorkSuspensionType, start: string | null): WorkSuspension =>
  ({ id: WS_ID, name: 'Typhoon', suspensionDate: '2026-10-08', suspensionType: type, suspensionStartTime: start, isArchived: false } as unknown as WorkSuspension);

const values = (list: Record<string, unknown>[], key: string) =>
  list.map((r) => [(r.leaveBenefitsId as LeaveBenefits)?.leaveName, Number(r[key])]);

describe('WorkSuspensionAddBackService', () => {
  it('spec example: SPL on Oct 8, suspension 16:00 (8-5) → +1 SPL, −0.875 VL, with ledger rows', async () => {
    const { service, rows } = makeHarness({ leaves: [{ lad: 'lad-1', employee: 'e1', benefit: 'spl' }] });
    const result = await service.applyForSuspension(suspension(WorkSuspensionType.TIME_OF_DAY, '16:00:00'));
    expect(result).toMatchObject({ created: 1, failed: 0 });
    expect(values(rows.get(LeaveCreditEarnings), 'creditValue')).toEqual([['Special Privilege Leave', 1]]);
    expect(values(rows.get(LeaveCreditDeductions), 'debitValue')).toEqual([['Vacation Leave', 0.875]]);
    expect(rows.get(LeaveCardLedgerCredit)).toHaveLength(1);
    expect(rows.get(LeaveCardLedgerDebit)).toHaveLength(1);
    expect(rows.get(LeaveCreditEarnings)[0]).toMatchObject({ workSuspensionId: WS_ID, addBackSourceId: 'lad-1' });
  });

  it('VL time of day → leave_add_back +f; FL whole day → +1 FL +1 VL', async () => {
    const tod = makeHarness({ leaves: [{ lad: 'lad-1', employee: 'e1', benefit: 'vl' }] });
    await tod.service.applyForSuspension(suspension(WorkSuspensionType.TIME_OF_DAY, '15:00:00'));
    expect(tod.rows.get(LeaveAddBack).map((r) => Number(r.creditValue))).toEqual([0.25]);
    expect(tod.rows.get(LeaveAddBack)[0]).toMatchObject({ workSuspensionId: WS_ID });

    const fl = makeHarness({ leaves: [{ lad: 'lad-2', employee: 'e2', benefit: 'fl' }] });
    await fl.service.applyForSuspension(suspension(WorkSuspensionType.WHOLE_DAY, null));
    expect(values(fl.rows.get(LeaveCreditEarnings), 'creditValue')).toEqual([
      ['Forced Leave', 1],
      ['Vacation Leave', 1],
    ]);
  });

  it('is idempotent: a second run credits nothing', async () => {
    const { service, rows } = makeHarness({
      leaves: [
        { lad: 'lad-1', employee: 'e1', benefit: 'spl' },
        { lad: 'lad-2', employee: 'e2', benefit: 'sl' },
      ],
      passSlips: [{ ps: 'ps-1', employee: 'e3' }],
    });
    const ws = suspension(WorkSuspensionType.TIME_OF_DAY, '13:00:00');
    expect(await service.applyForSuspension(ws)).toMatchObject({ created: 3, skipped: 0 });
    expect(await service.applyForSuspension(ws)).toMatchObject({ created: 0, skipped: 3 });
    expect(rows.get(LeaveCreditEarnings)).toHaveLength(2); // SPL + pass slip VL
    expect(rows.get(LeaveAddBack)).toHaveLength(1); // SL
  });

  it('half-day pass slip with complete logs → +0.5 VL', async () => {
    const { service, rows } = makeHarness({ passSlips: [{ ps: 'ps-1', employee: 'e3' }] });
    await service.applyForSuspension(suspension(WorkSuspensionType.TIME_OF_DAY, '15:00:00'));
    expect(values(rows.get(LeaveCreditEarnings), 'creditValue')).toEqual([['Vacation Leave', 0.5]]);
    expect(rows.get(LeaveCreditEarnings)[0]).toMatchObject({ addBackSourceId: 'ps-1' });
  });

  it('suspension after the schedule time out gives nothing', async () => {
    const { service, rows } = makeHarness({ leaves: [{ lad: 'lad-1', employee: 'e1', benefit: 'spl' }], passSlips: [{ ps: 'ps-1', employee: 'e1' }] });
    expect(await service.applyForSuspension(suspension(WorkSuspensionType.TIME_OF_DAY, '18:00:00'))).toMatchObject({ created: 0, skipped: 2 });
    expect(rows.get(LeaveCreditEarnings)).toHaveLength(0);
  });

  it('reverse removes every row and ledger link of the suspension', async () => {
    const { service, rows } = makeHarness({
      leaves: [
        { lad: 'lad-1', employee: 'e1', benefit: 'spl' },
        { lad: 'lad-2', employee: 'e2', benefit: 'vl' },
      ],
    });
    await service.applyForSuspension(suspension(WorkSuspensionType.TIME_OF_DAY, '16:00:00'));
    expect(await service.reverseForSuspension(WS_ID)).toEqual({ addBacks: 1, earnings: 1, deductions: 1 });
    for (const entity of [LeaveAddBack, LeaveCreditEarnings, LeaveCreditDeductions, LeaveCardLedgerCredit, LeaveCardLedgerDebit])
      expect(rows.get(entity)).toHaveLength(0);
  });

  it('LEGACY or archived suspensions are ignored', async () => {
    const { service } = makeHarness({ leaves: [{ lad: 'lad-1', employee: 'e1', benefit: 'vl' }] });
    expect(await service.applyForSuspension(suspension(WorkSuspensionType.LEGACY, null))).toBeNull();
    expect(await service.applyForSuspension({ ...suspension(WorkSuspensionType.WHOLE_DAY, null), isArchived: true } as WorkSuspension)).toBeNull();
  });
});
