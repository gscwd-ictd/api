import { HrmsUserPatterns, MicroserviceClient } from '@gscwd-api/microservices';
import { CreateUserDto } from '@gscwd-api/models';
import { HttpException, Injectable } from '@nestjs/common';

@Injectable()
export class HrmsUsersService {
  constructor(private readonly microserviceClient: MicroserviceClient) {}

  /* find lnd users */
  async findLndUsers(page: number, limit: number) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: HrmsUserPatterns.FIND_LND_USERS,
      payload: { page, limit },
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }

  /* find lnd assignable users */
  async findAssignableLndUsers() {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: HrmsUserPatterns.FIND_ASSIGNABLE_LND_USERS,
      payload: '',
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }

  /* create lnd users */
  async createLndUsers(data: CreateUserDto) {
    const { employeeId } = data;
    return await this.microserviceClient.call({
      action: 'send',
      pattern: HrmsUserPatterns.CREATE_LND_USERS,
      payload: employeeId,
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }

  /* delete lnd users by employee id */
  async deleteLndUsers(employeeId: string) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: HrmsUserPatterns.REMOVE_LND_USERS,
      payload: employeeId,
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }
}
