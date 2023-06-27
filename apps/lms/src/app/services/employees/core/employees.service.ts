import { FindEmployeesPatterns, MicroserviceClient } from '@gscwd-api/microservices';
import { HttpException, Injectable } from '@nestjs/common';

@Injectable()
export class EmployeesService {
  constructor(private readonly microserviceClient: MicroserviceClient) {}

  //find employees details by name match
  async findEmployeesByName(name: string) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: FindEmployeesPatterns.GET_EMPLOYEES_BY_NAME_MATCH,
      payload: name,
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }
}
