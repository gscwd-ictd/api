import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImsModule } from './logs/ims';
import { ImsLogs } from './logs/ims/data/ims.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      synchronize: true,
      logging: true,
      host: '10.10.1.5',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'logs',
      entities: [ImsLogs],
    }),
    ImsModule,
  ],
})
export class AppModule {}
