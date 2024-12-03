import { Controller, Get } from '@nestjs/common';
import { SmsService } from './sms.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

@Controller({ version: '1', path: 'sms' })
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Get()
  async sendSms() {
    return this.smsService.sendSms();
  }

  /* @MessagePattern('send_sms_v2')
  async findAllDistributionBySupervisorId(@Payload() supervisorId: string) {
    try {
      return await this.smsService.sendSms(supervisorId);
    } catch (error) {
      throw new RpcException(error);
    }
  } */
}
