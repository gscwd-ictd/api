import { ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { OvertimeStatus } from '@gscwd-api/utils';
import { OvertimeService } from '../core/overtime.service';

const SUPERVISOR = '11111111-1111-1111-1111-111111111111';
const OTHER = '22222222-2222-2222-2222-222222222222';
const OT_ID = 'ot-1';

function makeService(row: { status: OvertimeStatus; immediateSupervisorEmployeeId: string } | null) {
  const queries: { sql: string; params: unknown[] }[] = [];
  const entityManager = { query: jest.fn(async (sql: string, params: unknown[]) => queries.push({ sql, params })) };
  const service = Object.create(OvertimeService.prototype) as OvertimeService;
  Object.assign(service, {
    overtimeApplicationService: { rawQuery: jest.fn(async () => (row ? [{ id: OT_ID, ...row }] : [])) },
    dataSource: { transaction: jest.fn(async (fn: (em: unknown) => Promise<unknown>) => fn(entityManager)) },
  });
  return { service, queries };
}

describe('OvertimeService.immediateSupervisorCancelOvertimeApplication', () => {
  const dto = { immediateSupervisorEmployeeId: SUPERVISOR, remarks: 'no longer needed' };

  it.each([OvertimeStatus.PENDING, OvertimeStatus.APPROVED, OvertimeStatus.DISAPPROVED])('cancels an overtime that is %s', async (status) => {
    const { service, queries } = makeService({ status, immediateSupervisorEmployeeId: SUPERVISOR });
    const result = await service.immediateSupervisorCancelOvertimeApplication(OT_ID, dto);
    expect(result).toMatchObject({ cancelledOvertimeApplication: OT_ID, previousStatus: status, cancelledBy: SUPERVISOR, remarks: dto.remarks });
    expect(queries[0].sql).toContain('UPDATE overtime_application');
    expect(queries[0].params).toEqual([OvertimeStatus.CANCELLED, SUPERVISOR, expect.any(Date), dto.remarks, OT_ID]);
    expect(queries[1].sql).toContain('UPDATE overtime_approval');
  });

  it('404 when the overtime does not exist', async () => {
    const { service } = makeService(null);
    await expect(service.immediateSupervisorCancelOvertimeApplication(OT_ID, dto)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('403 when the caller is not the immediate supervisor', async () => {
    const { service, queries } = makeService({ status: OvertimeStatus.APPROVED, immediateSupervisorEmployeeId: OTHER });
    await expect(service.immediateSupervisorCancelOvertimeApplication(OT_ID, dto)).rejects.toBeInstanceOf(ForbiddenException);
    expect(queries).toHaveLength(0);
  });

  it('409 when already cancelled', async () => {
    const { service } = makeService({ status: OvertimeStatus.CANCELLED, immediateSupervisorEmployeeId: SUPERVISOR });
    await expect(service.immediateSupervisorCancelOvertimeApplication(OT_ID, dto)).rejects.toBeInstanceOf(ConflictException);
  });
});
