import { HrmsUserPatterns, MicroserviceClient } from '@gscwd-api/microservices';
import { HttpException, Injectable } from '@nestjs/common';

@Injectable()
export class HrmsUsersService {
  constructor(private readonly microserviceClient: MicroserviceClient) {}

  // find lnd users by app
  async findLndUsers() {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: HrmsUserPatterns.FIND_HRMS_USERS_BY_APP,
      payload: 'lnd',
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }

  // find lnd users assignable
  async findAssignableLndUsers() {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: HrmsUserPatterns.FIND_ASSIGNABLE_LND_USERS,
      payload: '',
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }

  // create lnd users
  async createLndUsers() {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: '',
      payload: '',
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }

  // remove lnd users
  async removeLndUsers(id: string) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: '',
      payload: id,
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }
}
