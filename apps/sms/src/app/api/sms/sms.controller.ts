import { Controller, Get } from '@nestjs/common';
import { SmsService } from './sms.service';

@Controller({ version: '1', path: 'sms' })
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Get()
  async sensSms() {
    return await this.smsService.sendSms();
  }
}
