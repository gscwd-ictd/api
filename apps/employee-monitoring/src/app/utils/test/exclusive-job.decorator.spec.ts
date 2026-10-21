import { ExclusiveJob, shouldRunScheduledJobs } from '../exclusive-job.decorator';

function makeService(lockResult: number) {
  const calls: string[] = [];
  const queryRunner = {
    connect: jest.fn(async () => undefined),
    release: jest.fn(async () => undefined),
    query: jest.fn(async (sql: string) => {
      calls.push(sql.trim().split('(')[0]);
      return sql.includes('GET_LOCK') ? [{ locked: lockResult }] : [{}];
    }),
  };
  class Service {
    runs = 0;
    getRepository() {
      return { manager: { connection: { createQueryRunner: () => queryRunner } } } as never;
    }
    @ExclusiveJob('test-job')
    async job() {
      this.runs++;
      return 'done';
    }
  }
  return { service: new Service(), queryRunner, calls };
}

describe('ExclusiveJob', () => {
  const original = process.env.NODE_APP_INSTANCE;
  afterEach(() => {
    if (original === undefined) delete process.env.NODE_APP_INSTANCE;
    else process.env.NODE_APP_INSTANCE = original;
  });

  it('runs the job when the lock is free, then releases the lock and the connection', async () => {
    delete process.env.NODE_APP_INSTANCE;
    const { service, queryRunner, calls } = makeService(1);
    await expect(service.job()).resolves.toBe('done');
    expect(service.runs).toBe(1);
    expect(calls).toEqual(['SELECT GET_LOCK', 'SELECT RELEASE_LOCK']);
    expect(queryRunner.release).toHaveBeenCalled();
  });

  it('skips the job when another run holds the lock', async () => {
    delete process.env.NODE_APP_INSTANCE;
    const { service, queryRunner, calls } = makeService(0);
    await service.job();
    expect(service.runs).toBe(0);
    expect(calls).toEqual(['SELECT GET_LOCK']);
    expect(queryRunner.release).toHaveBeenCalled();
  });

  it('skips the job on PM2 instances other than 0', async () => {
    process.env.NODE_APP_INSTANCE = '1';
    const { service, queryRunner } = makeService(1);
    await service.job();
    expect(service.runs).toBe(0);
    expect(queryRunner.connect).not.toHaveBeenCalled();
  });

  it('instance 0 or no PM2 instance runs jobs', () => {
    process.env.NODE_APP_INSTANCE = '0';
    expect(shouldRunScheduledJobs()).toBe(true);
    delete process.env.NODE_APP_INSTANCE;
    expect(shouldRunScheduledJobs()).toBe(true);
  });
});
