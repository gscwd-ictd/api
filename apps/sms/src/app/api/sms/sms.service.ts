import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SmsService {
  constructor(private readonly httpService: HttpService) {}

  async sendSms() {
    /* console.log('sms send');

    return 'hello world'; */
    const smsIp = process.env.SMS_HOST;
    const smsUser = process.env.SMS_USER;
    const smsPassword = process.env.SMS_PASS;
    const port = 1;
    const phoneNumber = '+639613522548';
    const message = 'test';

    /*  const url = `http://${smsIp}/cgi/WebCGI?1500101=account=${smsUser}&password=${smsPassword}&port=${randomPort}&destination=${phoneNumber}&content=${encodeURIComponent(
      message
    )}`; */

    const url = `http://${smsIp}/cgi/WebCGI?1500101=account=${encodeURIComponent(smsUser)}&password=${encodeURIComponent(
      smsPassword
    )}&port=${port}&destination=${phoneNumber}&content=${encodeURIComponent(message + port)}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-type': 'text/html',
        },
      });

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        // console.error('Error name:', error.name);
        // console.error('Error message:', error.message);
        // console.error('Error stack:', error.stack);
        //console.error('Error code', error.code);
        //console.error('Error code', error.data);
        console.error('err', error);
      }
    }
  }
}
