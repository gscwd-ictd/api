import { FindEmployeesPatterns, MicroserviceClient } from '@gscwd-api/microservices';
import { EmployeeFullNameRaw } from '@gscwd-api/utils';
import { HttpException, Injectable } from '@nestjs/common';

@Injectable()
export class HrmsEmployeesService {
  constructor(private readonly microserviceClient: MicroserviceClient) {}

  /* find all employees by name match */
  async findEmployeesByName(name: string) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: FindEmployeesPatterns.GET_EMPLOYEES_BY_NAME_MATCH,
      payload: name,
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }

  /* find employees name by id */
  async findEmployeesById(id: string) {
    return (await this.microserviceClient.call({
      action: 'send',
      pattern: FindEmployeesPatterns.GET_EMPLOYEES_BY_ID,
      payload: id,
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    })) as EmployeeFullNameRaw;
  }
}
