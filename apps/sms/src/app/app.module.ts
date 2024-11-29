import { Module } from '@nestjs/common';
import { SmsModule } from './api/sms/sms.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: join(__dirname, '../../../.env') }), SmsModule, ScheduleModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
