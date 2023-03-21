import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { init } from '../constants/queries';

@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor(private readonly datasource: DataSource) {}

  async onModuleInit() {
    await this.datasource.manager.transaction(async (manager) => await Promise.all([]));

    Logger.log('All Postgres functions have been successfully initialized', 'PostgresFunction');
  }
}
