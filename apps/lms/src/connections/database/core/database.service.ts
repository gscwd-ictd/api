import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor(private readonly datasource: DataSource) {}

  async onModuleInit() {
    await this.datasource.manager.transaction(
      async () =>
        await Promise.all([
          //initialize get lsp type
          //await manager.query(parseSql('apps/lms/src/connections/database/sql/get-lsp-fullname.functions.sql')),
        ])
    );
    Logger.log('All Postgres functions have been successfully initialized', 'PostgresFunction');
  }
}
