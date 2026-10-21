import { DailyTimeRecordService } from '../core/daily-time-record.service';

/** createDtrOnce: a simultaneous insert of the same employee + day returns the existing row instead of failing */
function makeService(createImpl: () => Promise<unknown>, existing: unknown) {
  const service = Object.create(DailyTimeRecordService.prototype) as DailyTimeRecordService;
  Object.assign(service, { crudService: { create: jest.fn(createImpl) }, findByCompanyIdAndDate: jest.fn(async () => existing) });
  return service;
}

describe('DailyTimeRecordService.createDtrOnce', () => {
  const dto = { companyId: '2017-029', dtrDate: '2026-10-21' };

  it('returns the new row when the insert succeeds', async () => {
    const service = makeService(async () => ({ id: 'new' }), null);
    await expect(service.createDtrOnce({ dto })).resolves.toEqual({ id: 'new' });
  });

  it('returns the existing row when another request inserted the same day first', async () => {
    const service = makeService(
      async () => {
        throw new Error("Duplicate entry '2017-029|2026-10-21' for key 'uq_dtr_company_day'");
      },
      { id: 'existing' }
    );
    await expect(service.createDtrOnce({ dto })).resolves.toEqual({ id: 'existing' });
  });

  it('rethrows other errors', async () => {
    const service = makeService(async () => {
      throw new Error('connection lost');
    }, null);
    await expect(service.createDtrOnce({ dto })).rejects.toThrow('connection lost');
  });
});
