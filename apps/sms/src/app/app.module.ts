import { Module } from '@nestjs/common';
import { SmsModule } from './api/sms/sms.module';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: join(__dirname, '../../../.env') }), SmsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
