import { Logger } from '@nestjs/common';
import { Repository } from 'typeorm';

/**
 * Runs a scheduled job at most once at a time across every API instance.
 *
 *  - PM2 cluster / several instances: only instance 0 (NODE_APP_INSTANCE) runs jobs.
 *  - Any other overlap (a second server, a restart during a run): a MySQL named lock (GET_LOCK) is taken
 *    on a dedicated connection; if another run holds it, this run is skipped.
 *
 * Use on methods of a CrudHelper service, under @Cron:
 *   @Cron('0 55 23 * * 0-6')
 *   @ExclusiveJob('pass-slip-ledger')
 *   async addPassSlipsToLedger() { ... }
 */
export function ExclusiveJob(name: string): MethodDecorator {
  const logger = new Logger('ExclusiveJob');
  return (_target, _key, descriptor: PropertyDescriptor) => {
    const original = descriptor.value;
    descriptor.value = async function (...args: unknown[]) {
      if (!shouldRunScheduledJobs()) {
        logger.log(`${name}: skipped on instance ${process.env.NODE_APP_INSTANCE}`);
        return;
      }
      const repository = (this as { getRepository: () => Repository<unknown> }).getRepository();
      const queryRunner = repository.manager.connection.createQueryRunner();
      const lockName = `ems-job:${name}`;
      let locked = false;
      try {
        await queryRunner.connect();
        const [row] = await queryRunner.query(`SELECT GET_LOCK(?, 0) locked;`, [lockName]);
        locked = Number(row?.locked) === 1;
        if (!locked) {
          logger.warn(`${name}: another run is in progress; this run is skipped`);
          return;
        }
        return await original.apply(this, args);
      } finally {
        if (locked) await queryRunner.query(`SELECT RELEASE_LOCK(?);`, [lockName]).catch(() => undefined);
        await queryRunner.release();
      }
    };
    return descriptor;
  };
}

/** Scheduled jobs run only on PM2 instance 0 (or when not running under PM2 cluster mode). */
export function shouldRunScheduledJobs(): boolean {
  const instance = process.env.NODE_APP_INSTANCE;
  return instance === undefined || instance === '' || instance === '0';
}
