import { MicroserviceClient } from '@gscwd-api/microservices';
import { HttpException, Injectable } from '@nestjs/common';

@Injectable()
export class SmsService {
  constructor(private readonly microserviceClient: MicroserviceClient) {}

  async sendSms() {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: { msg: 'send_sms' },
      payload: {
        msisdn: '09613522548',
        content: 'hello',
      },
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }
}
