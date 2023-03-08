import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConnectionConfig } from './connection.config';
import { ConnectionService } from './connection.service';

@Module({
  imports: [TypeOrmModule.forRootAsync({ useClass: DatabaseConnectionConfig })],
  providers: [ConnectionService],
})
export class ConnectionModule {}
