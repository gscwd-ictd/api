import { OvertimeService } from '../core/overtime.service';

function makeService(found: boolean) {
  const update = jest.fn(async () => ({ affected: 1 }));
  const overtimeAccomplishmentService = {
    rawQuery: jest.fn(async () => [{ plannedDate: '2026-10-28' }]),
    crud: () => ({ update }),
  };
  const overtimeEmployeeService = {
    crud: () => ({ findOneOrNull: jest.fn(async () => (found ? { id: 'oe-1' } : null)) }),
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const service = new (OvertimeService as any)(overtimeAccomplishmentService, overtimeEmployeeService) as OvertimeService;
  return { service, update };
}

const body = {
  employeeId: 'emp-1',
  overtimeApplicationId: 'ot-1',
  accomplishments: 'Reconnection',
  encodedTimeIn: '2026-10-28T12:00',
  encodedTimeInTime: '12:00',
  encodedTimeOut: '2026-10-28T19:00',
};

describe('OvertimeService.updateAccomplishments', () => {
  it('saves accomplishments and the encoded times only (extra form fields are ignored)', async () => {
    const { service, update } = makeService(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await service.updateAccomplishments(body as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { dto, updateBy } = (update.mock.calls[0] as any)[0];
    expect(Object.keys(dto).sort()).toEqual(['accomplishments', 'encodedTimeIn', 'encodedTimeOut']);
    expect(dto.encodedTimeIn).toBeInstanceOf(Date);
    expect(updateBy).toEqual({ overtimeEmployeeId: { id: 'oe-1' } });
  });

  it('404 when the employee is not on the overtime', async () => {
    const { service } = makeService(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await expect(service.updateAccomplishments(body as any)).rejects.toMatchObject({ status: 404 });
  });

  it('400 when the start is not on the planned date', async () => {
    const { service, update } = makeService(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await expect(service.updateAccomplishments({ ...body, encodedTimeIn: '2026-10-29T12:00' } as any)).rejects.toMatchObject({ status: 400 });
    expect(update).not.toHaveBeenCalled();
  });

  it('accomplishments only (no times) still saves', async () => {
    const { service, update } = makeService(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await service.updateAccomplishments({ employeeId: 'emp-1', overtimeApplicationId: 'ot-1', accomplishments: 'x' } as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((update.mock.calls[0] as any)[0].dto).toEqual({ accomplishments: 'x' });
  });
});
