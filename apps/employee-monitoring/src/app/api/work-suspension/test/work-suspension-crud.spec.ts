import { BadRequestException, ConflictException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { WorkSuspensionType } from '@gscwd-api/models';
import { WorkSuspensionService } from '../core/work-suspension.service';

const ID = '3f2fbfe4-5e7a-498f-bdac-753dbcc98831';

type QueryHandler = (sql: string, params?: unknown[]) => unknown[];

function makeService(handler: QueryHandler) {
  const crudService = {
    create: jest.fn(async ({ dto }) => ({ id: ID, ...dto })),
    update: jest.fn(async (_options: { dto: Record<string, unknown> }) => ({ affected: 1 })),
    delete: jest.fn(async () => ({ affected: 1 })),
  };
  const service = new WorkSuspensionService(crudService as never);
  jest.spyOn(service, 'rawQuery').mockImplementation(async (sql: string, params?: unknown[]) => handler(sql, params) as never);
  return { service, crudService };
}

const row = (over: Record<string, unknown> = {}) => ({
  id: ID,
  name: 'Typhoon',
  suspensionDate: '2026-10-20',
  suspensionType: WorkSuspensionType.TIME_OF_DAY,
  suspensionStartTime: '15:00:00',
  suspensionHours: null,
  isArchived: 0,
  memoNo: null,
  remarks: null,
  ...over,
});

describe('WorkSuspensionService CRUD', () => {
  describe('create', () => {
    it('creates a TIME_OF_DAY suspension with normalized start time and no hours', async () => {
      const { service, crudService } = makeService(() => []);
      await service.createWorkSuspension({
        name: 'Typhoon',
        suspensionDate: new Date('2026-10-20T00:00:00+08:00'),
        suspensionType: WorkSuspensionType.TIME_OF_DAY,
        suspensionStartTime: '15:00',
      });
      expect(crudService.create.mock.calls[0][0].dto).toMatchObject({
        suspensionDate: '2026-10-20',
        suspensionType: WorkSuspensionType.TIME_OF_DAY,
        suspensionStartTime: '15:00:00',
        suspensionHours: null,
        isArchived: false,
      });
    });

    it('drops the start time for WHOLE_DAY', async () => {
      const { service, crudService } = makeService(() => []);
      await service.createWorkSuspension({
        name: 'Holiday-like',
        suspensionDate: new Date('2026-10-20T00:00:00+08:00'),
        suspensionType: WorkSuspensionType.WHOLE_DAY,
        suspensionStartTime: '15:00',
      });
      expect(crudService.create.mock.calls[0][0].dto.suspensionStartTime).toBeNull();
    });

    it('422 when TIME_OF_DAY has no start time', async () => {
      const { service } = makeService(() => []);
      await expect(
        service.createWorkSuspension({ name: 'x', suspensionDate: new Date('2026-10-20'), suspensionType: WorkSuspensionType.TIME_OF_DAY })
      ).rejects.toBeInstanceOf(UnprocessableEntityException);
    });

    it('400 for LEGACY', async () => {
      const { service } = makeService(() => []);
      await expect(
        service.createWorkSuspension({ name: 'x', suspensionDate: new Date('2026-10-20'), suspensionType: WorkSuspensionType.LEGACY })
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('409 when the date already has an active suspension', async () => {
      const { service, crudService } = makeService((sql) => (sql.includes('is_archived = 0') ? [{ id: 'other' }] : []));
      await expect(
        service.createWorkSuspension({ name: 'x', suspensionDate: new Date('2026-10-20'), suspensionType: WorkSuspensionType.WHOLE_DAY })
      ).rejects.toBeInstanceOf(ConflictException);
      expect(crudService.create).not.toHaveBeenCalled();
    });
  });

  describe('update / delete', () => {
    it('updates an active suspension, excluding itself from the duplicate check', async () => {
      const { service, crudService } = makeService((sql, params) => {
        if (sql.includes('WHERE work_suspension_id = ?')) return [row()];
        if (sql.includes('work_suspension_id <> ?')) {
          expect(params).toEqual(['2026-10-20', ID]);
          return [];
        }
        return [];
      });
      await service.updateWorkSuspension(ID, { suspensionStartTime: '13:00' });
      expect(crudService.update.mock.calls[0][0].dto).toMatchObject({ suspensionStartTime: '13:00:00', suspensionType: WorkSuspensionType.TIME_OF_DAY });
    });

    it('switching to WHOLE_DAY clears the start time', async () => {
      const { service, crudService } = makeService((sql) => (sql.includes('WHERE work_suspension_id = ?') ? [row()] : []));
      await service.updateWorkSuspension(ID, { suspensionType: WorkSuspensionType.WHOLE_DAY });
      expect(crudService.update.mock.calls[0][0].dto.suspensionStartTime).toBeNull();
    });

    it.each([
      ['archived', row({ isArchived: 1 })],
      ['legacy', row({ suspensionType: WorkSuspensionType.LEGACY, suspensionHours: '4.00', isArchived: 0 })],
    ])('409 when editing or deleting a %s suspension', async (_label, existing) => {
      const { service, crudService } = makeService((sql) => (sql.includes('WHERE work_suspension_id = ?') ? [existing] : []));
      await expect(service.updateWorkSuspension(ID, { name: 'y' })).rejects.toBeInstanceOf(ConflictException);
      await expect(service.deleteWorkSuspension(ID)).rejects.toBeInstanceOf(ConflictException);
      expect(crudService.update).not.toHaveBeenCalled();
      expect(crudService.delete).not.toHaveBeenCalled();
    });

    it('404 for an unknown id', async () => {
      const { service } = makeService(() => []);
      await expect(service.deleteWorkSuspension(ID)).rejects.toBeInstanceOf(NotFoundException);
    });

    it('hard-deletes an active suspension', async () => {
      const { service, crudService } = makeService((sql) => (sql.includes('WHERE work_suspension_id = ?') ? [row()] : []));
      await service.deleteWorkSuspension(ID);
      expect(crudService.delete).toHaveBeenCalledWith(expect.objectContaining({ deleteBy: { id: ID }, softDelete: false }));
    });
  });

  describe('list / preview / legacy hours', () => {
    it('applies the date range and archived filter', async () => {
      let captured: { sql: string; params?: unknown[] } = { sql: '' };
      const { service } = makeService((sql, params) => {
        captured = { sql, params };
        return [row({ isArchived: 0 })];
      });
      const result = await service.getAllWorkSuspensions({ from: '2026-10-01', to: '2026-10-31', includeArchived: false });
      expect(captured.sql).toContain('suspension_date >= ?');
      expect(captured.sql).toContain('is_archived = 0');
      expect(captured.params).toEqual(['2026-10-01', '2026-10-31']);
      expect(result[0].isArchived).toBe(false);
    });

    it('previews suspended minutes per schedule', async () => {
      const { service } = makeService(() => [
        { scheduleId: 's1', scheduleName: '8-5', timeIn: '08:00:00', timeOut: '17:00:00', lunchOut: '12:00:00', lunchIn: '13:00:00', shift: 'day' },
        { scheduleId: 's2', scheduleName: '22-06', timeIn: '22:00:00', timeOut: '06:00:00', lunchOut: null, lunchIn: null, shift: 'night' },
      ]);
      const preview = await service.previewWorkSuspension(WorkSuspensionType.TIME_OF_DAY, '16:00');
      expect(preview.map((p) => [p.scheduleId, p.suspendedMinutes, p.fraction])).toEqual([
        ['s1', 60, 0.125],
        ['s2', 120, 0.25],
      ]);
    });

    it('legacy hours: 0 when none, value for LEGACY rows only', async () => {
      const none = makeService(() => []);
      expect(await none.service.getWorkSuspensionBySuspensionDate(new Date('2026-10-20'))).toBe(0);
      const legacy = makeService((sql) => {
        expect(sql).toContain("suspension_type = 'LEGACY'");
        return [{ suspensionHours: '4.00' }];
      });
      expect(await legacy.service.getWorkSuspensionBySuspensionDate(new Date('2024-07-22'))).toBe(4);
    });
  });
});
