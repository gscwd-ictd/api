import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import axios from 'axios';

@Injectable()
export class SmsService {
  constructor(private readonly httpService: HttpService) {}

  async sendSms() {
    /* console.log('sms send');

    return 'hello world'; */
    const smsIp = process.env.SMS_HOST;
    const smsUser = process.env.SMS_USER;
    const smsPassword = process.env.SMS_PASS;
    const port = [1, 2, 3, 5];
    const phoneNumber = '639613522548';
    const message = 'test asdsadsad';

    const randomPortIndex = Math.floor(Math.random() * port.length);
    const randomPort = port[randomPortIndex];

    /*  const url = `http://${smsIp}/cgi/WebCGI?1500101=account=${smsUser}&password=${smsPassword}&port=${randomPort}&destination=${phoneNumber}&content=${encodeURIComponent(
      message
    )}`; */

    const url = `http://${smsIp}/cgi/WebCGI?1500101=account=${encodeURIComponent(smsUser)}&password=${encodeURIComponent(
      smsPassword
    )}&port=${randomPort}&destination=${phoneNumber}&content=${encodeURIComponent(message)}`;

    try {
      const response = await axios({
        method: 'GET',
        insecureHTTPParser: false,
        url: url,
      });

      return response;
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw error; // Rethrow or handle the error as needed
    }

    // return await axios({
    //   method: 'get',
    //   url: url,
    //   responseType: 'text',
    // });

    // console.log();

    // await firstValueFrom(
    //   this.httpService.get(url).pipe(
    //     catchError((error: AxiosError) => {
    //       Logger.error(error);
    //       throw 'An error happened!';
    //     })
    //   )
    // );

    /* try {
      return this.httpService.get(url);
      await axios({
        method: 'get',
        url: url,
        responseType: 'json',
      })
        .then((response) => {
          Logger.log(response);
        })
        .catch((error) => {
          Logger.error('AXIOS ERROR! ', error);
        }); 
    } catch (error) {
      console.error('Error sending SMS:', error);
    }*/
  }
}
