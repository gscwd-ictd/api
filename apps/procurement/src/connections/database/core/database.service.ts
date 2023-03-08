import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { init } from '../constants/queries';

@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor(private readonly datasource: DataSource) {}

  async onModuleInit() {
    await this.datasource.manager.transaction(
      async (manager) =>
        await Promise.all([
          // initialize code_generator()
          await manager.query(init.code_generator),

          // initialize get_month()
          await manager.query(init.get_month),

          // initialize json_rename_attribute()
          await manager.query(init.jsonb_rename_attribute),

          // initialize jsonb_rename_attribute_in_array
          await manager.query(init.jsonb_rename_attribute_in_array),

          // initialize util_pr_code_seq table
          await manager.query(init.util_pr_code_seq),

          // initialize generate_pr_code() function
          await manager.query(init.generate_pr_code),

          // initialize create_pr() function
          await manager.query(init.create_pr),

          // initialize util_rfq_code_seq table
          await manager.query(init.util_rfq_code_seq),

          // initialize generate_rfq_code() function
          await manager.query(init.generate_rfq_code),

          // initialize create_rfq() function
          await manager.query(init.create_rfq),
        ])
    );

    Logger.log('All Postgres functions have been successfully initialized', 'PostgresFunction');
  }
}
