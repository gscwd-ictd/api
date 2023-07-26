import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { typeOrmEntities } from '../constants/entities';
import { appModules } from '../constants/modules';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: join(__dirname, '../../../apps/ivms-dtr/.env') }),
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.IVMS_DB_HOST,
      port: parseInt(process.env.IVMS_DB_PORT),
      database: process.env.IVMS_DB_NAME,
      username: process.env.IVMS_DB_USER,
      password: process.env.IVMS_DB_PASS,
      entities: [...typeOrmEntities],
      synchronize: true,
      logging: true,
      options: { trustServerCertificate: true, encrypt: false },
    }),
    ...appModules,
  ],
})
export class AppModule {}
