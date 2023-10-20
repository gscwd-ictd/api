import { FindEmployeesPatterns, MicroserviceClient } from '@gscwd-api/microservices';
import { PortalEmployeeDetailsRaw } from '@gscwd-api/utils';
import { HttpException, Injectable } from '@nestjs/common';

@Injectable()
export class PortalEmployeesService {
  constructor(private readonly microserviceClient: MicroserviceClient) {}

  // find employees details by id
  async findEmployeesDetailsById(id: string) {
    return (await this.microserviceClient.call({
      action: 'send',
      pattern: FindEmployeesPatterns.GET_EMPLOYEES_DETAILS_BY_ID,
      payload: id,
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    })) as PortalEmployeeDetailsRaw;
  }
}
